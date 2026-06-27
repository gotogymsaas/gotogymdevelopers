import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ConsentWithHistory, IntegrationConsent } from '../types/types';
import {
  authorizeConsent,
  getConsentHistory,
  listConsents,
  rejectConsent,
  revokeConsent,
} from '../src/services/consentsService';

export function useConsents() {
  const [consents, setConsents] = useState<IntegrationConsent[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ConsentWithHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [historyLoadingId, setHistoryLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listConsents()
      .then(setConsents)
      .catch(() => setError('No se pudieron cargar los consentimientos.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const applyUpdated = (updated: ConsentWithHistory) => {
    setConsents(current => current.map(consent => consent.id === updated.id ? updated : consent));
    setSelectedHistory(updated);
  };

  const runAction = async (
    id: string,
    action: (consentId: string) => Promise<ConsentWithHistory>,
  ) => {
    setSavingId(id);
    setError(null);
    try {
      const updated = await action(id);
      applyUpdated(updated);
    } catch {
      setError('No se pudo actualizar el consentimiento.');
    } finally {
      setSavingId(null);
    }
  };

  const authorize = (id: string) => runAction(id, authorizeConsent);
  const reject = (id: string) => runAction(id, rejectConsent);
  const revoke = (id: string) => runAction(id, revokeConsent);

  const loadHistory = async (id: string) => {
    setHistoryLoadingId(id);
    setError(null);
    try {
      setSelectedHistory(await getConsentHistory(id));
    } catch {
      setError('No se pudo consultar el historial.');
    } finally {
      setHistoryLoadingId(null);
    }
  };

  const counts = useMemo(() => ({
    authorized: consents.filter(consent => consent.status === 'authorized').length,
    pending: consents.filter(consent => consent.status === 'pending').length,
    inactive: consents.filter(consent => consent.status === 'rejected' || consent.status === 'revoked').length,
  }), [consents]);

  return {
    authorize,
    consents,
    counts,
    error,
    historyLoadingId,
    loadHistory,
    loading,
    reject,
    revoke,
    savingId,
    selectedHistory,
  };
}
