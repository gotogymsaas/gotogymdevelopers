import { useCallback, useEffect, useState } from 'react';
import { getCoachContext, type CoachContext, type CoachContextStatus, type GetCoachContextResult } from '../src/services/wellbeingService';

interface UseCoachContextOptions {
  enabled?: boolean;
  username?: string;
  includeText?: boolean;
}

interface UseCoachContextReturn {
  context: CoachContext | null;
  loading: boolean;
  error: string | null;
  status: CoachContextStatus;
  reload: () => void;
}

export function useCoachContext(options: UseCoachContextOptions = {}): UseCoachContextReturn {
  const { enabled = true, username, includeText = true } = options;

  const [context, setContext] = useState<CoachContext | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<CoachContextStatus>('success');

  const loadContext = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    const result: GetCoachContextResult = await getCoachContext(username, includeText);

    setContext(result.data);
    setStatus(result.status);

    if (result.status !== 'success') {
      setError(result.errorMessage ?? 'No se pudo cargar el contexto del coach.');
    }

    setLoading(false);
  }, [enabled, username, includeText]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    void loadContext();
  }, [enabled, loadContext]);

  return {
    context,
    loading,
    error,
    status,
    reload: loadContext,
  };
}