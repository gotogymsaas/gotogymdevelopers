import axios from 'axios';
import { getAuthToken } from '../../auth/rbac';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.VITE_API_URL) {
    return window.__APP_ENV__.VITE_API_URL;
  }

  return import.meta.env.VITE_API_URL ?? '';
};

const apiUrl = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export const isApiConfigured = (): boolean => apiUrl.length > 0;
