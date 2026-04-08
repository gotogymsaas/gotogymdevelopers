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

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  integrations,
  activeIntegrations,
  connectedSources,
  lastSync,
  processedEvents,
}) => {
  const metrics = [
    { label: 'Integraciones activas', value: String(activeIntegrations), sub: `de ${integrations.length} totales`, icon: '🔗', color: 'blue' },
    { label: 'Fuentes conectadas', value: String(connectedSources), sub: 'fuentes activas', icon: '📡', color: 'green' },
    { label: 'Última sincronización', value: fmtTime(lastSync), sub: 'última actividad', icon: '⏱️', color: 'yellow', small: true },
    { label: 'Eventos procesados', value: processedEvents.toLocaleString(), sub: 'este mes', icon: '⚡', color: 'purple' },
  ];

  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">📊 Dashboard</h2>
        <p className="gtg-section-desc">Vista general del sistema y métricas en tiempo real</p>
      </div>

      <div className="gtg-metrics-grid">
        {metrics.map(m => (
          <div className="gtg-metric-card" key={m.label}>
            <div className="gtg-metric-header">
              <span className="gtg-metric-label">{m.label}</span>
              <span className={`gtg-metric-icon ${m.color}`}>{m.icon}</span>
            </div>
            <div className={`gtg-metric-value${m.small ? ' gtg-metric-value--sm' : ''}`}>{m.value}</div>
            <div className="gtg-metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="gtg-dashboard-grid">
        <div className="gtg-panel-card">
          <div className="gtg-panel-card-title">🔌 Estado del Sistema</div>
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
          <div className="gtg-panel-card-title">📋 Actividad Reciente</div>
          {integrations
            .filter(i => i.lastSync !== null)
            .sort((a, b) => (b.lastSync ?? '').localeCompare(a.lastSync ?? ''))
            .map(i => (
              <div className="gtg-status-row" key={i.id}>
                <span className="gtg-status-row-name">
                  <span className={`status-dot ${i.status}`}></span>
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
