const fs = require('fs');
const path = require('path');

const EMPTY_STATE = () => ({
  version: 1,
  cache: {},
  queue: [],
  idMap: {},
  lastSyncAt: null,
  lastError: null
});

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function normalizeState(value) {
  if (!value || typeof value !== 'object') return EMPTY_STATE();

  return {
    ...EMPTY_STATE(),
    ...value,
    cache: value.cache && typeof value.cache === 'object' ? value.cache : {},
    queue: Array.isArray(value.queue) ? value.queue : [],
    idMap: value.idMap && typeof value.idMap === 'object' ? value.idMap : {}
  };
}

function idsIguais(a, b) {
  return a !== undefined && a !== null && b !== undefined && b !== null && String(a) === String(b);
}

function objetoTemId(item, id) {
  return idsIguais(item?.id, id) || idsIguais(item?.cpf, id) || idsIguais(item?.CPF, id);
}

function idDoCaminho(caminho) {
  const semQuery = caminho.split('?')[0];
  const partes = semQuery.split('/').filter(Boolean);
  const ultimo = partes.at(-1);

  if (!ultimo || ['status', 'prateleira'].includes(ultimo)) {
    return partes.at(-2);
  }

  return decodeURIComponent(ultimo);
}

function pertenceAoFiltro(caminho, body) {
  const produtoMatch = caminho.match(/\/produto\/([^?]+)/);
  if (produtoMatch && body?.idProduto !== undefined) {
    return idsIguais(decodeURIComponent(produtoMatch[1]), body.idProduto);
  }

  const medicoMatch = caminho.match(/\/medico\/([^?]+)/);
  if (medicoMatch && body?.idMedico !== undefined) {
    return idsIguais(decodeURIComponent(medicoMatch[1]), body.idMedico);
  }

  const query = caminho.split('?')[1];
  if (!query) return true;

  const params = new URLSearchParams(query);
  const idFarmacia = params.get('idFarmacia');
  return !idFarmacia || body?.idFarmacia === undefined || idsIguais(idFarmacia, body.idFarmacia);
}

function substituirValor(value, antigo, novo) {
  if (idsIguais(value, antigo) && (typeof value === 'string' || typeof value === 'number')) {
    return novo;
  }

  if (Array.isArray(value)) return value.map(item => substituirValor(item, antigo, novo));

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, substituirValor(item, antigo, novo)])
    );
  }

  return value;
}

function limparMarcacaoPendente(value, id) {
  if (Array.isArray(value)) return value.map(item => limparMarcacaoPendente(item, id));

  if (value && typeof value === 'object') {
    const result = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, limparMarcacaoPendente(item, id)])
    );
    if (objetoTemId(result, id)) delete result.pendenteSincronizacao;
    return result;
  }

  return value;
}

class OfflineStore {
  constructor() {
    this.state = EMPTY_STATE();
    this.filePath = null;
    this.ready = false;
    this.writeLock = Promise.resolve();
  }

  async init(directory) {
    if (!directory) throw new Error('Diretório do cache offline não informado.');

    fs.mkdirSync(directory, { recursive: true });
    this.filePath = path.join(directory, 'cache.json');

    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      this.state = normalizeState(JSON.parse(content));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        const corruptPath = `${this.filePath}.corrompido-${Date.now()}`;
        try {
          fs.renameSync(this.filePath, corruptPath);
        } catch (_) {
          // Se nem o backup for possível, um cache limpo ainda permite abrir o aplicativo.
        }
      }
      this.state = EMPTY_STATE();
    }

    this.ready = true;
    await this.persist();
  }

  async persist() {
    if (!this.ready || !this.filePath) return;

    this.writeLock = this.writeLock.then(() => {
      fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), 'utf8');
    });

    return this.writeLock;
  }

  async update(mutator) {
    const result = mutator(this.state);
    await this.persist();
    return result;
  }

  getCached(caminho) {
    return clone(this.state.cache[caminho]?.data);
  }

  findCachedEntity(caminho) {
    const procurado = idDoCaminho(caminho);
    if (!procurado) return undefined;

    for (const entry of Object.values(this.state.cache)) {
      if (!Array.isArray(entry?.data)) continue;
      const encontrado = entry.data.find(item => objetoTemId(item, procurado));
      if (encontrado) return clone(encontrado);
    }

    return undefined;
  }

  async cacheResponse(caminho, data) {
    await this.update(state => {
      state.cache[caminho] = { data: clone(data), updatedAt: new Date().toISOString() };
    });
  }

  hasPending() {
    return this.state.queue.some(item => item.status !== 'failed');
  }

  nextPending() {
    return clone(this.state.queue.find(item => item.status !== 'failed'));
  }

  async enqueue(operation) {
    await this.update(state => {
      state.queue.push(clone(operation));
      this.applyOptimistic(state, operation);
    });
  }

  async applyCommitted(operation, result) {
    await this.update(state => {
      this.applyOptimistic(state, operation);
      const realId = result?.id ?? operation.tempId ?? idDoCaminho(operation.path);
      state.cache = limparMarcacaoPendente(state.cache, realId);
      if (operation.path === '/api/lotes') {
        state.cache = limparMarcacaoPendente(state.cache, operation.body?.idProduto);
      }
      state.lastError = null;
      state.lastSyncAt = new Date().toISOString();
    });
  }

  applyOptimistic(state, operation) {
    const { method, path: caminho, body, tempId } = operation;
    const id = idDoCaminho(caminho);
    const objetoNovo = { ...(body || {}), id: tempId, pendenteSincronizacao: true };

    for (const [cachePath, entry] of Object.entries(state.cache)) {
      if (!Array.isArray(entry?.data)) continue;

      if (method === 'POST' && pertenceAoFiltro(cachePath, body)) {
        const recurso = caminho.split('?')[0];
        const cacheRecurso = cachePath.split('?')[0];
        const listaRelacionada = cacheRecurso === recurso ||
          (recurso === '/api/lotes' && cacheRecurso.startsWith('/api/lotes')) ||
          (recurso === '/api/teleconsultas' && cacheRecurso.startsWith('/api/teleconsultas/medico/'));

        const deveCriarLote = recurso !== '/api/lotes' || body?.numeroLote || body?.dataValidade;

        if (listaRelacionada && deveCriarLote) entry.data.push(clone(objetoNovo));

        if (recurso === '/api/lotes' && cacheRecurso === '/api/produtos') {
          const delta = (body?.tipo === 'saida' ? -1 : 1) * Number(body?.quantidade || 0);
          entry.data = entry.data.map(item => (
            objetoTemId(item, body?.idProduto)
              ? { ...item, quantidade: Number(item.quantidade || 0) + delta, pendenteSincronizacao: true }
              : item
          ));
        }
      }

      if (['PUT', 'PATCH'].includes(method)) {
        entry.data = entry.data.map(item => (
          objetoTemId(item, id)
            ? { ...item, ...(body || {}), pendenteSincronizacao: true }
            : item
        ));
      }

      if (method === 'DELETE') {
        entry.data = entry.data.filter(item => !objetoTemId(item, id));
      }
    }

    if (method === 'POST') {
      if (caminho === '/api/clientes' && body?.cpf) {
        const chave = `/api/clientes/${encodeURIComponent(body.cpf)}?idFarmacia=${encodeURIComponent(body.idFarmacia)}`;
        state.cache[chave] = { data: clone(objetoNovo), updatedAt: new Date().toISOString() };
      }
    } else if (state.cache[caminho]) {
      if (method === 'DELETE') delete state.cache[caminho];
      else state.cache[caminho].data = { ...state.cache[caminho].data, ...(body || {}), pendenteSincronizacao: true };
    }
  }

  async complete(operationId, result) {
    await this.update(state => {
      const operation = state.queue.find(item => item.id === operationId);
      if (!operation) return;

      const realId = result?.id;
      if (operation.tempId !== undefined && realId !== undefined && realId !== null) {
        state.idMap[String(operation.tempId)] = realId;
        state.cache = substituirValor(state.cache, operation.tempId, realId);
        state.queue = substituirValor(state.queue, operation.tempId, realId);
      }

      state.cache = limparMarcacaoPendente(state.cache, realId ?? operation.tempId ?? idDoCaminho(operation.path));
      if (operation.path === '/api/lotes') {
        state.cache = limparMarcacaoPendente(state.cache, operation.body?.idProduto);
      }

      state.queue = state.queue.filter(item => item.id !== operationId);
      state.lastError = null;
      state.lastSyncAt = new Date().toISOString();
    });
  }

  async markRetry(operationId, message) {
    await this.update(state => {
      const operation = state.queue.find(item => item.id === operationId);
      if (operation) {
        operation.attempts = (operation.attempts || 0) + 1;
        operation.lastError = message;
      }
      state.lastError = message;
    });
  }

  async markFailed(operationId, message) {
    await this.update(state => {
      const operation = state.queue.find(item => item.id === operationId);
      if (operation) {
        operation.status = 'failed';
        operation.attempts = (operation.attempts || 0) + 1;
        operation.lastError = message;
      }
      state.lastError = message;
    });
  }

  resolveOperation(operation) {
    let resolved = clone(operation);
    for (const [tempId, realId] of Object.entries(this.state.idMap)) {
      resolved = substituirValor(resolved, tempId, realId);
      resolved.path = resolved.path.replaceAll(encodeURIComponent(tempId), encodeURIComponent(realId));
    }
    return resolved;
  }

  status(extra = {}) {
    return {
      pendentes: this.state.queue.filter(item => item.status !== 'failed').length,
      comErro: this.state.queue.filter(item => item.status === 'failed').length,
      ultimaSincronizacao: this.state.lastSyncAt,
      ultimoErro: this.state.lastError,
      ...extra
    };
  }
}

module.exports = { OfflineStore };
