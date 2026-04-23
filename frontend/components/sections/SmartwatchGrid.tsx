import React, { useEffect, useMemo, useState } from 'react';
import type {
  SmartwatchMetric,
  SmartwatchMetricDetail,
  SmartwatchMetricDetailsMap,
  SmartwatchMetricId,
} from '../../types/types';
import { SmartwatchCard } from './SmartwatchCard';

interface SmartwatchGridProps {
  metrics: SmartwatchMetric[];
  detailsByMetric: SmartwatchMetricDetailsMap;
  preferredMetricId?: SmartwatchMetricId | null;
}

interface SmartwatchGridCard {
  cardId: string;
  metric: SmartwatchMetric;
  detail: SmartwatchMetricDetail;
}

const buildCardId = (metric: SmartwatchMetric, index: number): string => {
  const metricId = typeof metric.id === 'string' && metric.id.trim().length > 0
    ? metric.id
    : 'metric';

  return `${metricId}__${index}`;
};

const getMetricIcon = (metricId: SmartwatchMetricId): React.ReactNode => {
  switch (metricId) {
    case 'heart_rate':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case 'spo2':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3s5 5.1 5 9a5 5 0 0 1-10 0c0-3.9 5-9 5-9z" />
        </svg>
      );
    case 'sleep':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
        </svg>
      );
    case 'physical_activity':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <path d="m7 22 3-7 2 2 2-5 3 2" />
        </svg>
      );
    case 'stress':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'blood_pressure':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="m7 7 5-5 5 5" />
          <path d="m7 17 5 5 5-5" />
        </svg>
      );
    case 'ecg':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'body_temperature':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" />
        </svg>
      );
    case 'health_tracking':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h3l2 5 4-10 2 5h7" />
        </svg>
      );
    default:
      return null;
  }
};

const buildFallbackDetail = (metric: SmartwatchMetric): SmartwatchMetricDetail => ({
  sections: [
    {
      title: 'Detalle rapido',
      items: [
        {
          label: 'Valor actual',
          value: metric.value,
          tone: 'info',
        },
      ],
      note: metric.note,
    },
  ],
});

export const SmartwatchGrid: React.FC<SmartwatchGridProps> = ({
  metrics,
  detailsByMetric,
  preferredMetricId = null,
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cards = useMemo<SmartwatchGridCard[]>(() => {
    return metrics.map((metric, index) => ({
      cardId: buildCardId(metric, index),
      metric,
      detail: detailsByMetric[metric.id] ?? buildFallbackDetail(metric),
    }));
  }, [detailsByMetric, metrics]);

  const handleToggle = (cardId: string) => {
    setActiveCard(prev => (prev === cardId ? null : cardId));
  };

  useEffect(() => {
    if (!activeCard) {
      return;
    }

    if (!cards.some(card => card.cardId === activeCard)) {
      setActiveCard(null);
    }
  }, [activeCard, cards]);

  useEffect(() => {
    if (!preferredMetricId) {
      return;
    }

    const preferredCard = cards.find(card => card.metric.id === preferredMetricId);
    if (preferredCard) {
      setActiveCard(preferredCard.cardId);
    }
  }, [cards, preferredMetricId]);

  return (
    <div className="gtg-smartwatch-grid">
      {cards.map(card => {
        const isOpen = activeCard === card.cardId;

        return (
          <SmartwatchCard
            key={card.cardId}
            metric={card.metric}
            detail={card.detail}
            icon={getMetricIcon(card.metric.id)}
            isOpen={isOpen}
            onToggle={() => handleToggle(card.cardId)}
          />
        );
      })}
    </div>
  );
};
