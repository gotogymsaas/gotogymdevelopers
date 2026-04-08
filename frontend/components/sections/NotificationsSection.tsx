import React from 'react';
import type { Integration } from '../../types/types';
import { useNotifications } from '../../hooks/useNotifications';
import type { IntegrationAlert } from '../../hooks/useNotifications';

interface NotificationsSectionProps {
  integrations: Integration[];
  onNavigateToIntegration: (integrationId: string) => void;
}

const IcoBell = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IcoAlertTriangle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

function AlertCard({ alert, onNavigate }: { alert: IntegrationAlert; onNavigate: (id: string) => void }) {
  return (
    <div className="gtg-notif-alert-card">
      <div className="gtg-notif-alert-card-icon">
        <IcoAlertTriangle />
      </div>
      <div className="gtg-notif-alert-card-body">
        <div className="gtg-notif-alert-card-name">{alert.integrationName}</div>
        <div className="gtg-notif-alert-card-msg">{alert.message}</div>
        <button
          className="gtg-notif-alert-card-action"
          onClick={() => onNavigate(alert.integrationId)}
          title="Ver en tabla de integraciones"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          Ver integración <IcoArrow />
        </button>
      </div>
    </div>
  );
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  integrations,
  onNavigateToIntegration,
}) => {
  const { alerts, count } = useNotifications(integrations);

  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          Notificaciones
          {count > 0 && <span className="gtg-badge badge-danger" style={{ marginLeft: 10 }}>{count}</span>}
        </h2>
        <p className="gtg-section-desc">Alertas de integraciones desconectadas y eventos críticos</p>
      </div>

      {count === 0 ? (
        <div className="gtg-notif-page-empty">
          <div className="gtg-notif-page-empty-icon"><IcoBell /></div>
          <div className="gtg-notif-page-empty-title">Sin notificaciones</div>
          <div className="gtg-notif-page-empty-desc">
            Todas las integraciones están funcionando correctamente. Aparecerán alertas si alguna fuente se desconecta.
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            {count} {count === 1 ? 'integración requiere atención' : 'integraciones requieren atención'}
          </p>
          <div className="gtg-notif-page-grid">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onNavigate={onNavigateToIntegration}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
