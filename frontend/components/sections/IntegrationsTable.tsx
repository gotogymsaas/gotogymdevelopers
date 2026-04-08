import React, { useEffect, useRef } from 'react';
import type { Integration } from '../../types/types';

const integrationIcons: Record<string, string> = {
  apple: '🍎',
  google: '🔬',
  garmin: '⌚',
  fitbit: '💪',
  manual: '✏️',
};

interface IntegrationsTableProps {
  integrations: Integration[];
  selectedSource: string | null;
  uiState: string;
  onSelect: (id: string) => void;
  onSync: () => void;
  highlightedId?: string | null;
}

export const IntegrationsTable: React.FC<IntegrationsTableProps> = ({
  integrations,
  selectedSource,
  uiState,
  onSelect,
  onSync,
  highlightedId,
}) => {
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());

  useEffect(() => {
    if (!highlightedId) return;
    const el = rowRefs.current.get(highlightedId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedId]);
  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">🔗 Tabla de Integraciones</h2>
        <p className="gtg-section-desc">Gestiona y monitorea todas las fuentes de datos conectadas</p>
      </div>

      <div className="gtg-table-container">
        <div className="gtg-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="gtg-table-toolbar-title">Integraciones</span>
            <span className="gtg-table-count">{integrations.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="gtg-table-count" style={{ color: 'var(--success)', borderColor: '#a7f3d0' }}>
              ✔ {integrations.filter(i => i.status === 'connected').length} activas
            </span>
            <span className="gtg-table-count" style={{ color: 'var(--error)', borderColor: '#fecaca' }}>
              ✖ {integrations.filter(i => i.status === 'error').length} con error
            </span>
          </div>
        </div>

        <table className="gtg-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Última Sincronización</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map(i => (
              <tr
                key={i.id}
                ref={el => {
                  if (el) rowRefs.current.set(i.id, el);
                  else rowRefs.current.delete(i.id);
                }}
                className={[
                  selectedSource === i.id ? 'gtg-row-selected' : '',
                  highlightedId === i.id ? 'gtg-row-highlighted' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelect(i.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="gtg-integration-name">
                    <div className="gtg-integration-logo">
                      {integrationIcons[i.id] ?? '📦'}
                    </div>
                    {i.name}
                  </div>
                </td>
                <td>
                  <span className={`gtg-badge ${i.status}`}>
                    <span className={`status-dot ${i.status}`} style={{ width: 6, height: 6 }}></span>
                    {i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                  </span>
                </td>
                <td className="gtg-cell-muted">
                  {i.lastSync
                    ? new Date(i.lastSync).toLocaleString('es-MX', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </td>
                <td>
                  <button
                    className={`gtg-table-action-btn${i.status === 'error' ? ' retry' : ''}`}
                    disabled={i.status === 'disconnected' || uiState === 'loading'}
                    onClick={e => {
                      e.stopPropagation();
                      onSelect(i.id);
                      onSync();
                    }}
                  >
                    {uiState === 'loading' && selectedSource === i.id
                      ? '⏳ Sync...'
                      : i.status === 'error'
                      ? '↺ Retry'
                      : '↻ Sync'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
