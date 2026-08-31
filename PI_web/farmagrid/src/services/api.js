const API_URL = (import.meta.env.VITE_API_URL || 'https://farmagrid.onrender.com').replace(/\/$/, '');

export function getToken() {
  return localStorage.getItem('farmagrid_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('farmagrid_token', token);
  else localStorage.removeItem('farmagrid_token');
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.message || `Erro ${response.status}`;
    throw new Error(message);
  }

  return body;
}
