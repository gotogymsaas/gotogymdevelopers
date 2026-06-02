import { useCallback, useEffect, useState } from 'react';
import { getCoachContext, type CoachContextResponse } from '../src/services/wellbeingService';

interface UseCoachContextResult {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
  reload: () => Promise<void>;
}

export function useCoachContext(
  username?: string,
  enabled = true,
  refreshIntervalMs = 0,
): UseCoachContextResult {
  const [data, setData] = useState<CoachContextResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState<boolean>(false);

  const load = useCallback(async (silent = false) => {
    if (!enabled) {
      return;
    }

    if (!silent) {
      setLoading(true);
    }
    setError(null);
    setForbidden(false);

    try {
      const response = await getCoachContext(username);
      setData(response);
    } catch (err) {
      if (err instanceof Error && err.message === 'Forbidden') {
        setForbidden(true);
        setError('Acceso prohibido. Revisa tu token o permisos.');
      } else if (err instanceof Error && err.message === 'Unauthorized') {
        setError('Tu sesion no tiene un JWT valido. Cierra sesion e ingresa con credenciales reales de GoToGym.');
      } else {
        setError('No se pudo cargar el contexto de bienestar desde el backend.');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [username, enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    void load(false);
  }, [load, enabled]);

  useEffect(() => {
    if (!enabled || refreshIntervalMs <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void load(true);
    }, refreshIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [enabled, refreshIntervalMs, load]);

  return {
    data,
    loading,
    error,
    forbidden,
    reload: () => load(false),
  };
}
