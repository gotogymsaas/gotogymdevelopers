import React from 'react';

interface CardsSectionProps {
  activeIntegrations: number;
  connectedSources: number;
  lastSync: string;
  processedEvents: number;
}

const IcoLink = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IcoWifi = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);
const IcoClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoZap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoTrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

export const CardsSection: React.FC<CardsSectionProps> = ({
  activeIntegrations,
  connectedSources,
  lastSync,
  processedEvents,
}) => {
  const formattedSync =
    lastSync !== 'N/A'
      ? new Date(lastSync).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'N/A';

  const cards = [
    {
      icon: <IcoLink />,
      color: 'blue',
      title: 'Integraciones activas',
      value: String(activeIntegrations),
      desc: 'Fuentes con estado connected',
      trend: '+0 esta semana',
    },
    {
      icon: <IcoWifi />,
      color: 'green',
      title: 'Fuentes conectadas',
      value: String(connectedSources),
      desc: 'Excluye fuentes desconectadas',
      trend: 'Estable',
    },
    {
      icon: <IcoClock />,
      color: 'yellow',
      title: 'Última sincronización',
      value: formattedSync,
      small: true,
      desc: 'Timestamp de la última actividad',
      trend: 'Hace menos de 1h',
    },
    {
      icon: <IcoZap />,
      color: 'purple',
      title: 'Eventos procesados',
      value: processedEvents.toLocaleString(),
      desc: 'Total de eventos este mes',
      trend: '+142 hoy',
    },
  ];

  return (
    <div>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </span>
          Cards
        </h2>
        <p className="gtg-section-desc">Resumen de estadísticas clave de la plataforma</p>
      </div>

      <div className="gtg-cards-grid">
        {cards.map(card => (
          <div className={`gtg-stat-card ${card.color}`} key={card.title}>
            <div className={`gtg-stat-icon-wrap ${card.color}`}>{card.icon}</div>
            <div className="gtg-stat-info">
              <div className="gtg-stat-title">{card.title}</div>
              <div className={`gtg-stat-value${card.small ? ' gtg-metric-value--sm' : ''}`}>{card.value}</div>
              <div className="gtg-stat-desc">{card.desc}</div>
              <div className="gtg-stat-trend"><IcoTrendUp />{card.trend}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

