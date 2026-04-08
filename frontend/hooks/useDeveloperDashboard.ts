import { useState, useEffect } from 'react';
import type { Integration, BodyGraphData } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

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

  useEffect(() => {
    apiFetch<Integration[]>(`${API_URL}/api/integrations`)
      .then(data => setIntegrations(data))
      .catch(() => setError('Error al cargar integraciones.'));
  }, []);

  const handleSelectSource = (id: string) => setSelectedSource(id);

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
  };
}
