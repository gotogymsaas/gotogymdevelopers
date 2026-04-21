import { useCallback, useEffect, useState } from 'react';
import { smartwatchMetricsMock } from '../mocks/smartwatchMetrics';
import type { SmartwatchMetric } from '../types/types';
import { getAuthToken } from '../auth/rbac';

type SmartwatchDataSource = 'api' | 'mock';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface UseSmartwatchMetricsOptions {
  enabled?: boolean;
}

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.VITE_API_URL) {
    return window.__APP_ENV__.VITE_API_URL;
  }

  return (
    (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)
    || ''
  );
};

const parseApiPayload = (payload: unknown): SmartwatchMetric[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Payload invalido para smartwatch metrics.');
  }

  return payload as SmartwatchMetric[];
};

const parseApiResponse = (payload: unknown): SmartwatchMetric[] => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return parseApiPayload((payload as ApiResponse<unknown>).data);
  }

  return parseApiPayload(payload);
};

export function useSmartwatchMetrics(options: UseSmartwatchMetricsOptions = {}) {
  const { enabled = true } = options;
  const [metrics, setMetrics] = useState<SmartwatchMetric[]>(smartwatchMetricsMock);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<SmartwatchDataSource>('mock');

  const loadMetrics = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = getAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/v1/smartwatch/metrics`, {
        headers: authToken
          ? { Authorization: `Bearer ${authToken}` }
          : undefined,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const apiMetrics = parseApiResponse(payload);

      setMetrics(apiMetrics);
      setDataSource('api');
    } catch {
      // Fallback controlado para mantener la UI funcional cuando no existe backend real.
      setMetrics(smartwatchMetricsMock);
      setDataSource('mock');
      setError('No se pudo obtener data real. Mostrando datos simulados.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    void loadMetrics();
  }, [enabled, loadMetrics]);

  return {
    metrics,
    loading,
    error,
    dataSource,
    reloadMetrics: loadMetrics,
  };
}
