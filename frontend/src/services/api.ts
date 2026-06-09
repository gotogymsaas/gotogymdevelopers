import axios from 'axios';
import { clearStoredSession, getAuthToken } from '../../auth/rbac';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.VITE_API_URL) {
    return window.__APP_ENV__.VITE_API_URL;
  }

  if (typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined') {
    const apiUrl = (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL;
    if (apiUrl) {
      return apiUrl;
    }
  }

  if (typeof process !== 'undefined' && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }

  return '';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    if (!config.headers) {
      config.headers = {};
    }

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      clearStoredSession();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export { api, getApiBaseUrl };
