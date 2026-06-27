import React, { useEffect, useRef } from 'react';
import type { Integration } from '../../types/types';
import { useIntegrationsMarketplace } from '../../hooks/useIntegrationsMarketplace';

interface IntegrationsMarketplaceSectionProps {
  integrations: Integration[];
  selectedSource: string | null;
  uiState: string;
  onSelect: (id: string) => void;
  onConnect: (id: string) => void;
  syncingId?: string | null;
  highlightedId?: string | null;
}

const providerInitial = (name: string): string =>
  name
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const statusLabel: Record<Integration['status'], string> = {
  connected: 'Conectada',
  disconnected: 'Desconectada',
  syncing: 'Sincronizando',
  error: 'Error',
  syncing_error: 'Error de sync',
  timeout: 'Timeout',
  pending_review: 'En revision',
  failed: 'Fallida',
  unauthorized: 'Sin autorizacion',
};

export const IntegrationsMarketplaceSection: React.FC<IntegrationsMarketplaceSectionProps> = ({
  integrations,
  selectedSource,
  uiState,
  onSelect,
  onConnect,
  syncingId,
  highlightedId,
}) => {
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const marketplace = useIntegrationsMarketplace({
    integrations,
    selectedSource,
    onSelect,
    onConnect,
  });

  useEffect(() => {
    if (!highlightedId) {
      return;
    }

    cardRefs.current.get(highlightedId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedId]);

  return (
    <section className="gtg-integrations-marketplace">
      <div className="gtg-section-header gtg-integrations-header">
        <div>
          <p className="gtg-section-kicker">Integraciones</p>
          <h2 className="gtg-section-title">Marketplace</h2>
          <p className="gtg-section-desc">
            Catalogo operativo para conectar fuentes de salud, actividad y bienestar con GoToGym Developers.
          </p>
        </div>
        <div className="gtg-integrations-summary" aria-label="Resumen de integraciones">
          <span>{marketplace.connectedCount} conectadas</span>
          <span>{integrations.length} disponibles</span>
        </div>
      </div>

      <div className="gtg-integrations-toolbar" aria-label="Filtros de integraciones">
        <button
          className={`gtg-filter-chip${marketplace.activeFilter === 'all' ? ' active' : ''}`}
          onClick={() => marketplace.setActiveFilter('all')}
        >
          Todas
        </button>
        {marketplace.categories.map(category => (
          <button
            key={category}
            className={`gtg-filter-chip${marketplace.activeFilter === category ? ' active' : ''}`}
            onClick={() => marketplace.setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="gtg-integrations-grid">
        {marketplace.visibleIntegrations.map(integration => {
          const isSyncing = syncingId === integration.id || integration.status === 'syncing';
          const isSelected = selectedSource === integration.id;
          const isConfigured = marketplace.configuredId === integration.id;

          return (
            <article
              key={integration.id}
              ref={el => {
                if (el) {
                  cardRefs.current.set(integration.id, el);
                } else {
                  cardRefs.current.delete(integration.id);
                }
              }}
              className={[
                'gtg-integration-card',
                isSelected ? ' selected' : '',
                highlightedId === integration.id ? ' highlighted' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="gtg-integration-card-head">
                <div className="gtg-integration-provider">
                  <span className="gtg-integration-provider-mark">{providerInitial(integration.name)}</span>
                  <div>
                    <h3>{integration.name}</h3>
                    <span>{integration.providerKey ?? integration.id}</span>
                  </div>
                </div>
                <span className={`gtg-badge ${integration.status}`}>
                  <span className={`status-dot ${integration.status}`} />
                  {statusLabel[integration.status]}
                </span>
              </div>

              <p className="gtg-integration-description">{integration.description}</p>

              <div className="gtg-integration-meta">
                <span>{integration.category}</span>
                <span>
                  {integration.lastSync
                    ? new Date(integration.lastSync).toLocaleDateString('es-CO', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Sin sincronizar'}
                </span>
              </div>

              <div className="gtg-integration-actions">
                <button
                  className="gtg-btn gtg-btn-primary"
                  disabled={isSyncing || uiState === 'loading'}
                  onClick={() => marketplace.connectIntegration(integration.id)}
                >
                  {isSyncing ? 'Conectando...' : integration.status === 'connected' ? 'Reconectar' : 'Conectar'}
                </button>
                <button
                  className="gtg-btn gtg-btn-secondary"
                  disabled={!integration.configurable}
                  onClick={() => marketplace.configureIntegration(integration.id)}
                >
                  {isConfigured ? 'Configurada' : 'Configurar'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
