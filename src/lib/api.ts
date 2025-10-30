const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL?.toString()?.replace(/\/$/, '') || '';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export async function apiFetch<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
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


