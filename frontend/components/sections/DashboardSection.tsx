import React from 'react';
import type { Integration } from '../../types/types';

interface DashboardSectionProps {
  integrations: Integration[];
  activeIntegrations: number;
  connectedSources: number;
  lastSync: string;
  processedEvents: number;
}

function fmtTime(iso: string): string {
  return iso !== 'N/A'
    ? new Date(iso).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';
}

const IcoUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoLink = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IcoClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoTrendUp = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const statusColors: Record<string, string> = {
  connected: 'var(--success)',
  disconnected: 'var(--danger)',
  syncing: 'var(--warning)',
  error: 'var(--danger)',
};

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  integrations,
  activeIntegrations,
  connectedSources,
  lastSync,
  processedEvents,
}) => {
  const metrics = [
    { label: 'Integraciones activas', value: String(activeIntegrations), sub: `de ${integrations.length} totales`, icon: <IcoUsers />, color: 'blue', trend: '+2 esta semana' },
    { label: 'Fuentes conectadas', value: String(connectedSources), sub: 'fuentes activas', icon: <IcoLink />, color: 'green', trend: 'Estable' },
    { label: 'Última sincronización', value: fmtTime(lastSync), sub: 'última actividad', icon: <IcoClock />, color: 'yellow', small: true, trend: 'Hace poco' },
    { label: 'Eventos procesados', value: processedEvents.toLocaleString(), sub: 'este mes', icon: <IcoZap />, color: 'purple', trend: '+142 hoy' },
  ];

  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          Dashboard
        </h2>
        <p className="gtg-section-desc">Vista general del sistema y métricas en tiempo real</p>
      </div>

      <div className="gtg-metrics-grid">
        {metrics.map(m => (
          <div className={`gtg-metric-card ${m.color}`} key={m.label}>
            <div className="gtg-metric-header">
              <span className="gtg-metric-label">{m.label}</span>
              <span className={`gtg-metric-icon ${m.color}`}>{m.icon}</span>
            </div>
            <div className={`gtg-metric-value${m.small ? ' gtg-metric-value--sm' : ''}`}>{m.value}</div>
            <div className="gtg-metric-sub">{m.sub}</div>
            <div className="gtg-metric-trend"><IcoTrendUp />{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="gtg-dashboard-grid">
        <div className="gtg-panel-card">
          <div className="gtg-panel-card-title">Estado del Sistema</div>
          {integrations.map(i => (
            <div className="gtg-status-row" key={i.id}>
              <span className="gtg-status-row-name">
                <span className={`status-dot ${i.status}`}></span>
                {i.name}
              </span>
              <span className={`gtg-badge ${i.status}`}>
                {i.status.charAt(0).toUpperCase() + i.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="gtg-panel-card">
          <div className="gtg-panel-card-title">Actividad Reciente</div>
          {integrations
            .filter(i => i.lastSync !== null)
            .sort((a, b) => (b.lastSync ?? '').localeCompare(a.lastSync ?? ''))
            .map(i => (
              <div className="gtg-status-row" key={i.id}>
                <span className="gtg-status-row-name">
                  <span className="gtg-intg-dot" style={{ background: statusColors[i.status] ?? '#94a3b8' }}></span>
                  {i.name}
                </span>
                <span className="gtg-status-row-time">
                  {i.lastSync
                    ? new Date(i.lastSync).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
