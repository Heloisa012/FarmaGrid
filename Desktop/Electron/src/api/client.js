const crypto = require('crypto');
const { OfflineStore } = require('./offline-store');

const BASE_URL = process.env.API_BASE_URL || 'https://farmagrid.onrender.com';
const store = new OfflineStore();

let token = null;
let initialized = false;
let online = true;
let syncing = false;
let syncPromise = null;
let syncAgainRequested = false;
let syncTimer = null;
let notifyStatus = () => {};
// Sem limite por padrão: serviços públicos (como o Render) podem levar bastante
// tempo para responder durante o cold start. Um timeout continua disponível de
// forma opcional por meio de API_TIMEOUT_MS.
let requestTimeoutMs = Number(process.env.API_TIMEOUT_MS) || 0;

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function setToken(novoToken) {
  token = typeof novoToken === 'string' ? novoToken.trim() : null;

  if (token && initialized && store.hasPending()) {
    sincronizarPendencias().catch(() => {});
  }
}

function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function statusAtual() {
  return store.status({ online, sincronizando: syncing });
}

function emitirStatus() {
  try {
    notifyStatus(statusAtual());
  } catch (error) {
    console.error('Não foi possível atualizar o indicador offline:', error.message);
  }
}

async function configurarCacheOffline({ directory, onStatusChange, timeoutMs } = {}) {
  if (typeof onStatusChange === 'function') notifyStatus = onStatusChange;
  if (Number(timeoutMs) > 0) requestTimeoutMs = Number(timeoutMs);

  await store.init(directory);
  initialized = true;
  emitirStatus();
  return statusAtual();
}

function iniciarSincronizacaoAutomatica(intervalMs = 15000) {
  pararSincronizacaoAutomatica();
  syncTimer = setInterval(() => {
    sincronizarPendencias().catch(() => {});
  }, intervalMs);
  syncTimer.unref?.();

  sincronizarPendencias().catch(() => {});
}

function pararSincronizacaoAutomatica() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = null;
}

async function lerResposta(res) {
  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  const corpo = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const detalhe = typeof corpo === 'string' ? corpo : (corpo?.message || JSON.stringify(corpo));
    throw new ApiError(
      detalhe ? `Erro HTTP ${res.status}: ${detalhe}` : `Erro HTTP ${res.status}`,
      res.status,
      corpo
    );
  }

  return corpo;
}

async function fetchComTimeout(url, options = {}) {
  if (requestTimeoutMs <= 0) {
    return fetch(url, options);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`A API não respondeu em ${requestTimeoutMs / 1000} segundos.`);
      timeoutError.code = 'API_TIMEOUT';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestRaw(method, caminho, body) {
  console.log(`${method} pela API:`, { path: caminho, tokenPresente: Boolean(token) });

  const res = await fetchComTimeout(`${BASE_URL}${caminho}`, {
    method,
    headers: method === 'GET'
      ? { ...authHeaders() }
      : { 'Content-Type': 'application/json', ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  return lerResposta(res);
}

function erroTemporario(error) {
  if (!(error instanceof ApiError)) return true;
  return [408, 425, 429].includes(error.status) || error.status >= 500;
}

function erroDeAutenticacao(error) {
  return error instanceof ApiError && [401, 403].includes(error.status);
}

function criarOperacao(method, caminho, body) {
  const tempId = method === 'POST' ? -(Date.now() + Math.floor(Math.random() * 1000)) : undefined;
  return {
    id: crypto.randomUUID(),
    tempId,
    method,
    path: caminho,
    body,
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending'
  };
}

async function enfileirar(method, caminho, body) {
  if (!initialized) throw new Error('O cache offline ainda não foi inicializado.');

  const operation = criarOperacao(method, caminho, body);
  await store.enqueue(operation);
  online = false;
  emitirStatus();

  return method === 'POST'
    ? { ...(body || {}), id: operation.tempId, offline: true, pendenteSincronizacao: true }
    : { offline: true, pendenteSincronizacao: true };
}

async function registrarAlteracaoNoCache(method, caminho, body, result) {
  if (!initialized) return;
  const operation = criarOperacao(method, caminho, body);
  if (result?.id !== undefined) operation.tempId = result.id;
  else if (body?.id !== undefined) operation.tempId = body.id;
  await store.applyCommitted(operation, result);
}

async function apiGet(caminho) {
  try {
    if (initialized && store.hasPending()) {
      await sincronizarPendencias();
      if (!online) {
        const cachedAfterSync = store.getCached(caminho) ?? store.findCachedEntity(caminho);
        if (cachedAfterSync !== undefined) return cachedAfterSync;
      }
    }

    const result = await requestRaw('GET', caminho);
    online = true;
    if (initialized) await store.cacheResponse(caminho, result);
    emitirStatus();
    return result;
  } catch (error) {
    if (!erroTemporario(error) || !initialized) throw error;

    online = false;
    const cached = store.getCached(caminho) ?? store.findCachedEntity(caminho);
    emitirStatus();

    if (cached !== undefined) {
      console.warn(`API indisponível; usando cache local para GET ${caminho}.`);
      return cached;
    }

    throw new Error(`Sem conexão e sem dados em cache para ${caminho}.`);
  }
}

async function apiSend(method, caminho, body) {
  const podeEnfileirar = initialized && !caminho.startsWith('/auth/');

  if (podeEnfileirar && store.hasPending()) {
    const queued = await enfileirar(method, caminho, body);
    sincronizarPendencias().catch(() => {});
    return queued;
  }

  try {
    const result = await requestRaw(method, caminho, body);
    online = true;
    if (podeEnfileirar) {
      await registrarAlteracaoNoCache(method, caminho, body, result);
    }
    emitirStatus();
    return result;
  } catch (error) {
    if (!podeEnfileirar || !erroTemporario(error)) {
      if (erroTemporario(error)) {
        online = false;
        emitirStatus();
      }
      throw error;
    }
    return enfileirar(method, caminho, body);
  }
}

async function executarSincronizacao() {
  if (!initialized || !store.hasPending()) return statusAtual();

  syncing = true;
  emitirStatus();

  try {
    let operation;
    while ((operation = store.nextPending())) {
      const resolved = store.resolveOperation(operation);

      try {
        const result = await requestRaw(resolved.method, resolved.path, resolved.body);
        await store.complete(operation.id, result);
        online = true;
        emitirStatus();
      } catch (error) {
        if (erroTemporario(error) || erroDeAutenticacao(error)) {
          await store.markRetry(operation.id, error.message);
          online = !erroTemporario(error);
          break;
        }

        // Erros definitivos (por exemplo, validação 400) ficam visíveis no status,
        // mas não bloqueiam as operações seguintes da fila.
        await store.markFailed(operation.id, error.message);
        online = true;
      }
    }
  } finally {
    syncing = false;
    emitirStatus();
  }

  return statusAtual();
}

function sincronizarPendencias() {
  syncAgainRequested = true;
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    do {
      syncAgainRequested = false;
      await executarSincronizacao();
    } while (syncAgainRequested && store.hasPending());

    return statusAtual();
  })().finally(() => {
    syncPromise = null;
  });

  return syncPromise;
}

const apiPost = (caminho, body) => apiSend('POST', caminho, body);
const apiPut = (caminho, body) => apiSend('PUT', caminho, body);
const apiPatch = (caminho, body) => apiSend('PATCH', caminho, body);
const apiDelete = caminho => apiSend('DELETE', caminho);

async function apiGetBuffer(caminho) {
  const res = await fetchComTimeout(`${BASE_URL}${caminho}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new ApiError(`Erro HTTP ${res.status}`, res.status);
  return Buffer.from(await res.arrayBuffer());
}

async function apiPostMultipart(caminho, campos) {
  const form = new FormData();
  for (const [chave, valor] of Object.entries(campos)) {
    if (valor === undefined || valor === null) continue;
    if (Buffer.isBuffer(valor)) {
      form.append(chave, new Blob([valor]), campos.nomeArquivo || 'arquivo.pdf');
    } else {
      form.append(chave, String(valor));
    }
  }

  const res = await fetchComTimeout(`${BASE_URL}${caminho}`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form
  });
  return lerResposta(res);
}

module.exports = {
  setToken,
  configurarCacheOffline,
  iniciarSincronizacaoAutomatica,
  pararSincronizacaoAutomatica,
  sincronizarPendencias,
  obterStatusCache: statusAtual,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiGetBuffer,
  apiPostMultipart
};
