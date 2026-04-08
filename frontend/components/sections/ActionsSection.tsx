import React from 'react';
import type { Integration } from '../../types/types';

interface ActionsSectionProps {
  integrations: Integration[];
  selectedSource: string | null;
  uiState: string;
  onSelect: (id: string) => void;
  onSync: () => void;
}

const IcoZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoWifi = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

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
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </span>
          Acciones
        </h2>
        <p className="gtg-section-desc">Ejecuta operaciones y gestiona conexiones manualmente</p>
      </div>

      <div className="gtg-actions-layout">
        {/* Sync card */}
        <div className="gtg-action-card">
          <div className="gtg-action-card-header">
            <span className="gtg-action-card-icon blue"><IcoZap /></span>
            <div>
              <div className="gtg-action-card-title">Operaciones de Sincronización</div>
              <div className="gtg-action-card-desc">Selecciona una fuente de datos y ejecuta operaciones sobre ella.</div>
            </div>
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
                ? <><span className="gtg-spinner" />&nbsp;Sincronizando...</>
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

        {/* Connections card */}
        <div className="gtg-action-card">
          <div className="gtg-action-card-header">
            <span className="gtg-action-card-icon teal"><IcoWifi /></span>
            <div>
              <div className="gtg-action-card-title">Estado de Conexiones</div>
              <div className="gtg-action-card-desc">Conecta o desconecta fuentes de datos disponibles.</div>
            </div>
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

