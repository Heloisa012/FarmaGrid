const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

test('usa cache em GET offline e sincroniza escritas pendentes', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'farmagrid-offline-test-'));
  const originalFetch = global.fetch;
  const requests = [];
  const requestBodies = [];
  let connected = true;

  global.fetch = async (url, options = {}) => {
    const method = options.method || 'GET';
    requests.push(method);
    if (!connected) throw new TypeError('fetch failed');

    if (method === 'POST') {
      requestBodies.push(JSON.parse(options.body));
      return jsonResponse({ id: String(url).endsWith('/api/lotes') ? 456 : 123 });
    }
    return jsonResponse([{ id: 1, nome: 'Produto já salvo', idFarmacia: 7 }]);
  };

  try {
    const client = require('../src/api/client');
    await client.configurarCacheOffline({ directory, timeoutMs: 100 });

    const online = await client.apiGet('/api/produtos?idFarmacia=7');
    assert.equal(online[0].nome, 'Produto já salvo');

    connected = false;
    const cached = await client.apiGet('/api/produtos?idFarmacia=7');
    assert.deepEqual(cached, online);

    const queued = await client.apiPost('/api/produtos', {
      nome: 'Produto offline',
      idFarmacia: 7
    });
    assert.equal(queued.offline, true);

    await client.apiPost('/api/lotes', {
      idProduto: queued.id,
      tipo: 'entrada',
      quantidade: 2
    });
    assert.equal(client.obterStatusCache().pendentes, 2);

    connected = true;
    await client.sincronizarPendencias();
    assert.equal(client.obterStatusCache().pendentes, 0);
    assert.equal(requestBodies.at(-1).idProduto, 123);

    connected = false;
    const depoisDaSincronizacao = await client.apiGet('/api/produtos?idFarmacia=7');
    assert.equal(depoisDaSincronizacao.at(-1).id, 123);
    assert.equal(depoisDaSincronizacao.at(-1).quantidade, 2);
    assert.equal(depoisDaSincronizacao.at(-1).pendenteSincronizacao, undefined);
    assert.ok(requests.includes('POST'));
  } finally {
    clientSafeStop();
    global.fetch = originalFetch;
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('localiza o arquivo de um relatorio criado offline pelo ID temporario', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'farmagrid-report-cache-test-'));
  const { OfflineStore } = require('../src/api/offline-store');
  const store = new OfflineStore();

  try {
    await store.init(directory);
    const lista = '/api/desktop/relatorios-farmacia?idFarmacia=7';
    await store.cacheResponse(lista, []);
    await store.enqueue({
      id: 'operacao-relatorio',
      tempId: -20,
      method: 'POST',
      path: '/api/desktop/relatorios-farmacia',
      body: {
        idFarmacia: 7,
        nomeArquivo: 'estoque.pdf',
        caminho: 'C:\\Downloads\\estoque.pdf',
        arquivoBase64: 'cGRm'
      },
      status: 'pending'
    });

    const relatorio = store.findCachedEntity(
      '/api/desktop/relatorios-farmacia/-20/arquivo?idFarmacia=7'
    );
    assert.equal(relatorio.id, -20);
    assert.equal(relatorio.arquivoBase64, 'cGRm');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

function clientSafeStop() {
  try {
    require('../src/api/client').pararSincronizacaoAutomatica();
  } catch (_) {
    // O módulo pode não ter sido carregado caso o teste falhe antes da configuração.
  }
}

test('mantém os dados otimistas do Desktop no filtro correto', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'farmagrid-desktop-cache-test-'));
  const { OfflineStore } = require('../src/api/offline-store');
  const store = new OfflineStore();

  try {
    await store.init(directory);
    await store.cacheResponse('/api/desktop/parceiros?idMedico=1', []);
    await store.cacheResponse('/api/desktop/parceiros?idMedico=2', []);
    await store.enqueue({
      id: 'operacao-parceiro',
      tempId: -10,
      method: 'POST',
      path: '/api/desktop/parceiros',
      body: { idMedico: 1, parceiro: 'Laboratório Offline' },
      status: 'pending'
    });

    const medico1 = store.getCached('/api/desktop/parceiros?idMedico=1');
    const medico2 = store.getCached('/api/desktop/parceiros?idMedico=2');
    assert.equal(medico1.length, 1);
    assert.equal(medico1[0].nome, 'Laboratório Offline');
    assert.equal(medico2.length, 0);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
