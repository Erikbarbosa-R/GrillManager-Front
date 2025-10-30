import { apiFetch } from '../lib/api';

export type Restaurant = {
  id?: string;
  name: string;
  description?: string;
  address?: any;
  contact?: { phone?: string; email?: string };
  deliverySettings?: any;
  operatingHours?: any;
  isOpen?: boolean;
  estimatedPrepTime?: number;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiResponse<T> = { success: boolean; data?: T; message?: string; error?: any };

export function getRestaurant(signal?: AbortSignal) {
  return apiFetch<ApiResponse<Restaurant>>('/restaurant', { method: 'GET', signal });
}

export function updateRestaurant(payload: {
  name: string;
  description?: string;
  address?: any;
  phone?: string;
  email?: string;
  logo?: string;
  theme?: { primaryColor?: string; secondaryColor?: string };
}) {
  return apiFetch<ApiResponse<Restaurant>>('/restaurant', { method: 'PUT', body: payload });
}


