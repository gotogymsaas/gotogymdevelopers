import React from 'react';

interface CardsSectionProps {
  activeIntegrations: number;
  connectedSources: number;
  lastSync: string;
  processedEvents: number;
}

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
      icon: '🔗',
      color: 'blue',
      title: 'Integraciones activas',
      value: String(activeIntegrations),
      desc: 'Fuentes con estado connected',
      trend: '+0 esta semana',
    },
    {
      icon: '📡',
      color: 'green',
      title: 'Fuentes conectadas',
      value: String(connectedSources),
      desc: 'Excluye fuentes desconectadas',
      trend: 'Estable',
    },
    {
      icon: '⏱️',
      color: 'yellow',
      title: 'Última sincronización',
      value: formattedSync,
      desc: 'Timestamp de la última actividad',
      trend: 'Hace menos de 1h',
    },
    {
      icon: '⚡',
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
        <h2 className="gtg-section-title">🃏 Cards</h2>
        <p className="gtg-section-desc">Resumen de estadísticas clave de la plataforma</p>
      </div>

      <div className="gtg-cards-grid">
        {cards.map(card => (
          <div className="gtg-stat-card" key={card.title}>
            <div className={`gtg-stat-icon-wrap ${card.color}`}>{card.icon}</div>
            <div className="gtg-stat-info">
              <div className="gtg-stat-title">{card.title}</div>
              <div className="gtg-stat-value">{card.value}</div>
              <div className="gtg-stat-desc">{card.desc}</div>
              <div className="gtg-stat-trend">{card.trend}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
