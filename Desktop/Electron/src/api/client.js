const BASE_URL = process.env.API_BASE_URL || 'https://farmagrid.onrender.com';

let token = null;

function setToken(novoToken) {
  token = typeof novoToken === 'string'
    ? novoToken.trim()
    : null;
}

function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tratarResposta(res) {
  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  const corpo = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const mensagem = typeof corpo === 'string' ? corpo : (corpo?.message || JSON.stringify(corpo));
    throw new Error(
      mensagem
        ? `Erro HTTP ${res.status}: ${mensagem}`
        : `Erro HTTP ${res.status}`
    );
  }

  return corpo;
}

async function apiGet(path) {
  console.log('GET pela API:', {
    path,
    tokenPresente: Boolean(token)
  });

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...authHeaders()
    }
  });

  return tratarResposta(res);
}

async function apiSend(method, path, body) {
  console.log('Requisição API:', {
    method,
    path,
    tokenPresente: Boolean(token)
  });
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return tratarResposta(res);
}

const apiPost = (path, body) => apiSend('POST', path, body);
const apiPut = (path, body) => apiSend('PUT', path, body);
const apiPatch = (path, body) => apiSend('PATCH', path, body);
const apiDelete = (path) => apiSend('DELETE', path);

// ── Download binário (ex.: PDF de relatório) ─────────────────────────────────
async function apiGetBuffer(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ── Upload multipart (ex.: PDF de relatório) ─────────────────────────────────
async function apiPostMultipart(path, campos) {
  const form = new FormData();
  for (const [chave, valor] of Object.entries(campos)) {
    if (valor === undefined || valor === null) continue;
    if (Buffer.isBuffer(valor)) {
      form.append(chave, new Blob([valor]), campos.nomeArquivo || 'arquivo.pdf');
    } else {
      form.append(chave, String(valor));
    }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });
  return tratarResposta(res);
}

module.exports = {
  setToken,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiGetBuffer,
  apiPostMultipart,
};
