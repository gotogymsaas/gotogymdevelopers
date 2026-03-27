import { useState } from 'react';
import { Integration, BodyGraphData } from '../types/types';
import { integrationsMock, bodyGraphMock } from '../mocks/mockData';

type UIState = 'initial' | 'loading' | 'success' | 'error';

export function useDeveloperDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>(integrationsMock);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [uiState, setUiState] = useState<UIState>('initial');
  const [bodyGraph, setBodyGraph] = useState<BodyGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectSource = (id: string) => setSelectedSource(id);

  const handleSync = async () => {
    if (!selectedSource) return;
    setUiState('loading');
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setBodyGraph({ ...bodyGraphMock, source: integrations.find(i => i.id === selectedSource)?.name || '' });
      setUiState('success');
    } catch (e) {
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
