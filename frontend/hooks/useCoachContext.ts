import { useEffect, useState } from 'react';
import { getCoachContext, type CoachContextResponse } from '../src/services/wellbeingService';

interface UseCoachContextResult {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
  reload: () => Promise<void>;
}

export function useCoachContext(username?: string, enabled = true): UseCoachContextResult {
  const [data, setData] = useState<CoachContextResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState<boolean>(false);

  const load = async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);
    setForbidden(false);

    try {
      const response = await getCoachContext(username);
      setData(response);
    } catch (err) {
      if (err instanceof Error && err.message === 'Forbidden') {
        setForbidden(true);
        setError('Acceso prohibido. Revisa tu token o permisos.');
      } else {
        setError('No se pudo cargar el contexto de bienestar. Se utiliza información de respaldo.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    void load();
  }, [username, enabled]);

  return {
    data,
    loading,
    error,
    forbidden,
    reload: load,
  };
}
