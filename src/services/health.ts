import { apiFetch } from '../lib/api';

export type HealthResponse = {
  success: boolean;
  data?: {
    status: string;
    uptime: number;
    timestamp: string;
    env: string;
  };
  message?: string;
  error?: any;
};

export function getHealth(signal?: AbortSignal) {
  return apiFetch<HealthResponse>('/health', { method: 'GET', signal });
}


