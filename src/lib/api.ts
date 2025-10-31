const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL?.toString()?.replace(/\/$/, '') || '';

// Validação e aviso em desenvolvimento/produção
if (!API_BASE) {
  console.error(
    '[API] VITE_API_BASE_URL não está configurada! Configure na Vercel: https://grillmanager-back-production.up.railway.app/api'
  );
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export async function apiFetch<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!API_BASE) {
    throw new Error(
      'VITE_API_BASE_URL não configurada. Configure a variável de ambiente na Vercel com: https://grillmanager-back-production.up.railway.app/api'
    );
  }
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    credentials: 'include',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw json || { success: false, message: `HTTP ${res.status}` };
  return json as T;
}

export function getApiBase(): string {
  return API_BASE || '';
}


