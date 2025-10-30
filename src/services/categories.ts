import { apiFetch } from '../lib/api';

export type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiResponse<T> = { success: boolean; data?: T; message?: string; error?: any };

export function listCategories(signal?: AbortSignal) {
  return apiFetch<ApiResponse<Category[]>>('/categories', { method: 'GET', signal });
}

export function createCategory(payload: { name: string; description?: string; icon?: string }) {
  return apiFetch<ApiResponse<Category>>('/categories', { method: 'POST', body: payload });
}

export function getCategory(id: string, signal?: AbortSignal) {
  return apiFetch<ApiResponse<Category>>(`/categories/${id}`, { method: 'GET', signal });
}

export function updateCategory(id: string, payload: { name?: string; description?: string; icon?: string }) {
  return apiFetch<ApiResponse<Category>>(`/categories/${id}`, { method: 'PUT', body: payload });
}

export function deleteCategory(id: string) {
  return apiFetch<ApiResponse<{ id: string }>>(`/categories/${id}`, { method: 'DELETE' });
}


