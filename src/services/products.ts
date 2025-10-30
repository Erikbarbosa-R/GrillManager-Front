import { apiFetch } from '../lib/api';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  popular: boolean;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiResponse<T> = { success: boolean; data?: T; message?: string; error?: any };

export function listProducts(signal?: AbortSignal) {
  return apiFetch<ApiResponse<Product[]>>('/products', { method: 'GET', signal });
}

export function createProduct(payload: {
  name: string;
  description: string;
  price: number | string;
  category: string;
  image?: string;
  popular?: boolean;
  available?: boolean;
}) {
  return apiFetch<ApiResponse<Product>>('/products', { method: 'POST', body: payload });
}

export function getProduct(id: string, signal?: AbortSignal) {
  return apiFetch<ApiResponse<Product>>(`/products/${id}`, { method: 'GET', signal });
}

export function updateProduct(id: string, payload: {
  name?: string;
  description?: string;
  price?: number | string;
  category?: string;
  image?: string;
  popular?: boolean;
  available?: boolean;
}) {
  return apiFetch<ApiResponse<Product>>(`/products/${id}`, { method: 'PUT', body: payload });
}

export function deleteProduct(id: string) {
  return apiFetch<ApiResponse<{ id: string }>>(`/products/${id}`, { method: 'DELETE' });
}


