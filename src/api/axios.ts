import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from '../lib/apiConfig';
import { disconnectEcho } from '../services/echoService';
import { getToken, removeToken } from '../services/tokenService';

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

function resolveAcceptLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  const lang = navigator.language?.slice(0, 2).toLowerCase();
  return lang === 'my' ? 'my' : 'en';
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept-Language'] = resolveAcceptLanguage();
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await removeToken();
      disconnectEcho();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return 'Cannot reach the API server. Start devcollab_api with `php artisan serve` and check VITE_API_URL in .env.';
      }
    }
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.message) return data.message;
    if (data?.errors) {
      const first = Object.values(data.errors)[0]?.[0];
      if (first) return first;
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function extractErrors(error: unknown, fallback = 'Something went wrong.'): string[] {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return ['Cannot reach the server. Check your connection.'];
      }
    }
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.errors) {
      return Object.values(data.errors).flat();
    }
    if (data?.message) return [data.message];
  }
  if (error instanceof Error) return [error.message];
  return [fallback];
}
