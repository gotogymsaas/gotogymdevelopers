import { useState, useEffect } from 'react';
import type { Integration, BodyGraphData, IntegrationStatus } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

/** Estados posibles al hacer Sync (nunca "connected") */
export const NON_CONNECTED_STATUSES: IntegrationStatus[] = [
  'disconnected',
  'syncing_error',
  'timeout',
  'pending_review',
  'failed',
  'unauthorized',
  'error',
];

function randomNonConnectedStatus(): IntegrationStatus {
  return NON_CONNECTED_STATUSES[Math.floor(Math.random() * NON_CONNECTED_STATUSES.length)] ?? 'disconnected';
}

type UIState = 'initial' | 'loading' | 'success' | 'error';

type ApiResponse<T> = { success: boolean; data: T };

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  // Desenvolver {success, data} si existe
  return (json && typeof json === 'object' && 'data' in json)
    ? (json as ApiResponse<T>).data
    : json as T;
}

export function useDeveloperDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [uiState, setUiState] = useState<UIState>('initial');
  const [bodyGraph, setBodyGraph] = useState<BodyGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** ID de la integración que está procesando su Sync local */
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Integration[]>(`${API_URL}/api/integrations`)
      .then(data => setIntegrations(data))
      .catch(() => setError('Error al cargar integraciones.'));
  }, []);

  const handleSelectSource = (id: string) => setSelectedSource(id);

  /** Sync simulado: cambia el estado de la integración a uno aleatorio no-connected */
  const syncIntegration = (id: string) => {
    setSyncingId(id);
    setSelectedSource(id);
    setTimeout(() => {
      const newStatus = randomNonConnectedStatus();
      setIntegrations(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, status: newStatus, lastSync: new Date().toISOString() }
            : i,
        ),
      );
      setSyncingId(null);
    }, 900);
  };

  const handleSync = async () => {
    if (!selectedSource) return;
    setUiState('loading');
    setError(null);
    try {
      await apiFetch(`${API_URL}/api/integrations/${selectedSource}/sync`, { method: 'POST' });
      const data = await apiFetch<BodyGraphData>(`${API_URL}/api/bodygraph/${selectedSource}`);
      setBodyGraph(data);
      setUiState('success');
    } catch {
      setError('Error al sincronizar la fuente.');
      setUiState('error');
    }
  };

  return {
    integrations,
    selectedSource,
    setSelectedSource: handleSelectSource,
    uiState,
    bodyGraph,
    error,
    handleSync,
    syncIntegration,
    syncingId,
  };
}
