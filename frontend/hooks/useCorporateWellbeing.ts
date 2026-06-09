import { useCallback, useEffect, useState } from 'react';
import {
  getCorporateWellbeing,
  type CorporateWellbeingParams,
  type CorporateWellbeingResponse,
} from '../src/services/corporateWellbeingService';

interface UseCorporateWellbeingResult {
  data: CorporateWellbeingResponse | null;
  loading: boolean;
  error: string | null;
  reload: (nextParams?: CorporateWellbeingParams) => void;
  params: CorporateWellbeingParams;
}

export function useCorporateWellbeing(
  initialParams: CorporateWellbeingParams = { days: 30 },
): UseCorporateWellbeingResult {
  const [params, setParams] = useState<CorporateWellbeingParams>(initialParams);
  const [data, setData] = useState<CorporateWellbeingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback((nextParams?: CorporateWellbeingParams) => {
    if (nextParams) {
      setParams(current => ({ ...current, ...nextParams }));
      return;
    }

    setParams(current => ({ ...current }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getCorporateWellbeing(params)
      .then(response => {
        if (!cancelled) {
          setData(response);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar bienestar corporativo.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [params]);

  return { data, loading, error, reload, params };
}
