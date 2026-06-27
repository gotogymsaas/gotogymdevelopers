import React from 'react';
import { useConsents } from '../../hooks/useConsents';
import type { ConsentAuditAction, ConsentStatus, IntegrationConsent } from '../../types/types';

const statusLabels: Record<ConsentStatus, string> = {
  pending: 'Pendiente',
  authorized: 'Autorizado',
  rejected: 'Rechazado',
  revoked: 'Revocado',
};

const actionLabels: Record<ConsentAuditAction, string> = {
  'consent.requested': 'Solicitud creada',
  'consent.authorized': 'Autorizado',
  'consent.rejected': 'Rechazado',
  'consent.revoked': 'Revocado',
};

const scopeLabels: Record<string, string> = {
  'profile.read': 'Perfil',
  'wellbeing.read': 'Bienestar',
  'metrics.read': 'Metricas',
  'analytics.read': 'Analitica',
  'organization.read': 'Organizacion',
  'devices.read': 'Dispositivos',
  'documents.read': 'Documentos',
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'Sin autorizacion';
  }

  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getAuthorizationDate = (consent: IntegrationConsent) =>
  consent.authorizedAt ?? consent.rejectedAt ?? consent.revokedAt ?? consent.requestedAt;

interface ConsentCardProps {
  consent: IntegrationConsent;
  historyLoading: boolean;
  saving: boolean;
  onAuthorize: (id: string) => void;
  onReject: (id: string) => void;
  onRevoke: (id: string) => void;
  onHistory: (id: string) => void;
}

const ConsentCard: React.FC<ConsentCardProps> = ({
  consent,
  historyLoading,
  saving,
  onAuthorize,
  onReject,
  onRevoke,
  onHistory,
}) => (
  <article className={`gtg-consent-card ${consent.status}`}>
    <div className="gtg-consent-card-head">
      <div>
        <p className="gtg-consent-owner">{consent.ownerCompany}</p>
        <h3>{consent.integrationName}</h3>
      </div>
      <span className={`gtg-consent-status ${consent.status}`}>{statusLabels[consent.status]}</span>
    </div>

    <div className="gtg-consent-meta">
      <span>Fecha</span>
      <strong>{formatDate(getAuthorizationDate(consent))}</strong>
    </div>

    <div className="gtg-consent-scopes" aria-label="Scopes solicitados">
      {consent.requestedScopes.map(scope => (
        <span key={scope}>{scopeLabels[scope] ?? scope}</span>
      ))}
    </div>

    <div className="gtg-consent-actions">
      {consent.status !== 'authorized' && (
        <button className="gtg-btn gtg-btn-primary" disabled={saving} onClick={() => onAuthorize(consent.id)}>
          {saving ? 'Procesando...' : 'Autorizar'}
        </button>
      )}
      {consent.status === 'pending' && (
        <button className="gtg-btn gtg-btn-secondary" disabled={saving} onClick={() => onReject(consent.id)}>
          Rechazar
        </button>
      )}
      {consent.status === 'authorized' && (
        <button className="gtg-btn gtg-btn-danger" disabled={saving} onClick={() => onRevoke(consent.id)}>
          {saving ? 'Procesando...' : 'Revocar'}
        </button>
      )}
      <button className="gtg-btn gtg-btn-secondary" disabled={historyLoading} onClick={() => onHistory(consent.id)}>
        {historyLoading ? 'Cargando...' : 'Historial'}
      </button>
    </div>
  </article>
);

export const ConsentsSection: React.FC = () => {
  const {
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
  } = useConsents();

  return (
    <section className="gtg-consents-section">
      <div className="gtg-section-header gtg-consents-header">
        <div>
          <p className="gtg-section-kicker">Privacidad y terceros</p>
          <h2 className="gtg-section-title">Consentimientos</h2>
          <p className="gtg-section-desc">
            Revisa que integraciones pueden acceder a tus datos y controla cada autorizacion.
          </p>
        </div>
        <div className="gtg-consent-summary">
          <span>{counts.authorized} autorizados</span>
          <span>{counts.pending} pendientes</span>
          <span>{counts.inactive} inactivos</span>
        </div>
      </div>

      {error && <p className="gtg-form-error">{error}</p>}

      <div className="gtg-consents-layout">
        <div className="gtg-consents-grid">
          {loading && <p className="gtg-cell-muted">Cargando consentimientos...</p>}
          {!loading && consents.map(consent => (
            <ConsentCard
              key={consent.id}
              consent={consent}
              saving={savingId === consent.id}
              historyLoading={historyLoadingId === consent.id}
              onAuthorize={authorize}
              onReject={reject}
              onRevoke={revoke}
              onHistory={loadHistory}
            />
          ))}
        </div>

        <aside className="gtg-consent-history-panel">
          <div className="gtg-consent-history-head">
            <span>Historial</span>
            <strong>{selectedHistory?.integrationName ?? 'Selecciona una integracion'}</strong>
          </div>

          {!selectedHistory && (
            <p className="gtg-cell-muted">Consulta el historial para ver autorizaciones, rechazos y revocaciones.</p>
          )}

          {selectedHistory && (
            <div className="gtg-consent-timeline">
              {selectedHistory.history.map(event => (
                <div key={event.id} className="gtg-consent-timeline-item">
                  <span className={`gtg-consent-dot ${event.status}`} />
                  <div>
                    <strong>{actionLabels[event.action]}</strong>
                    <span>{formatDate(event.createdAt)} por {event.actorUserId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
