import React from 'react';
import type { Integration } from '../../types/types';

interface ActionsSectionProps {
  integrations: Integration[];
  selectedSource: string | null;
  uiState: string;
  onSelect: (id: string) => void;
  onSync: () => void;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({
  integrations,
  selectedSource,
  uiState,
  onSelect,
  onSync,
}) => {
  const isLoading = uiState === 'loading';

  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">⚡ Acciones</h2>
        <p className="gtg-section-desc">Ejecuta operaciones y gestiona conexiones manualmente</p>
      </div>

      <div className="gtg-actions-layout">
        <div className="gtg-action-card">
          <div className="gtg-action-card-title">⚡ Operaciones de Sincronización</div>
          <div className="gtg-action-card-desc">
            Selecciona una fuente de datos y ejecuta operaciones sobre ella.
          </div>

          <div className="gtg-source-select-row">
            <select
              className="gtg-select"
              value={selectedSource ?? ''}
              onChange={e => onSelect(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>Selecciona una fuente...</option>
              {integrations.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          <div className="gtg-action-buttons">
            <button
              className="gtg-btn gtg-btn-primary"
              onClick={onSync}
              disabled={!selectedSource || isLoading}
            >
              {isLoading
                ? <><span className="gtg-spinner"></span>&nbsp;Sincronizando...</>
                : '▷ Run Sync'}
            </button>

            <button
              className="gtg-btn gtg-btn-danger"
              disabled={!selectedSource || isLoading}
              onClick={onSync}
            >
              ↺ Retry
            </button>

            <button
              className="gtg-btn gtg-btn-secondary"
              disabled={!selectedSource}
            >
              {'{ }'} View Payload
            </button>

            <button
              className="gtg-btn gtg-btn-success"
              disabled={isLoading}
            >
              + Connect
            </button>
          </div>
        </div>

        <div className="gtg-action-card">
          <div className="gtg-action-card-title">🔌 Estado de Conexiones</div>
          <div className="gtg-action-card-desc">
            Conecta o desconecta fuentes de datos disponibles en la plataforma.
          </div>
          <div className="gtg-connect-list">
            {integrations.map(i => (
              <div className="gtg-connect-row" key={i.id}>
                <div className="gtg-connect-name">
                  <span className={`status-dot ${i.status}`}></span>
                  {i.name}
                </div>
                <button
                  className={`gtg-btn ${i.status === 'disconnected' ? 'gtg-btn-success' : 'gtg-btn-secondary'}`}
                  style={{ padding: '5px 14px', fontSize: '0.75rem' }}
                >
                  {i.status === 'disconnected' ? '+ Connect' : '⏏ Disconnect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
