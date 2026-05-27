import React, { useMemo } from 'react';
import { DynamicInfoCard } from '../ui/DynamicInfoCard';
import type { CoachContextResponse } from '../../src/services/wellbeingService';

interface AppGoToGymSectionProps {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
}

const fieldMetadata: Record<string, { title: string; description: string; status: 'success' | 'info' | 'warning' | 'error'; icon: string }> = {
  wellbeing_experience_value_v1: {
    title: 'Wellbeing Experience',
    description: 'Experiencia de bienestar del usuario generada por la plataforma.',
    status: 'info',
    icon: '🌱',
  },
  experience_value_pack: {
    title: 'Experience Value Pack',
    description: 'Resumen del paquete de experiencia asociado al coach.',
    status: 'success',
    icon: '✨',
  },
  portfolio_summary: {
    title: 'Portfolio Summary',
    description: 'Resumen de portafolio para la experiencia de usuario.',
    status: 'info',
    icon: '📊',
  },
  if_variable_payload: {
    title: 'Variable Payload',
    description: 'Payload dinámico utilizado para generar recomendaciones.',
    status: 'warning',
    icon: '🧬',
  },
  global_wellbeing: {
    title: 'Global Wellbeing',
    description: 'Indicador global de bienestar del usuario.',
    status: 'success',
    icon: '💚',
  },
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return 'No disponible';
  }

  if (typeof value === 'string') {
    return value.trim() || 'No disponible';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const AppGoToGymSection: React.FC<AppGoToGymSectionProps> = ({
  data,
  loading,
  error,
  forbidden,
}) => {
  const cards = useMemo(() => {
    const wellbeing = data?.wellbeing_experience_value_v1;
    if (!wellbeing) {
      return [];
    }

    return Object.entries(wellbeing)
      .filter(([key, value]) => fieldMetadata[key] && value !== undefined && value !== null)
      .map(([key, value]) => ({
        key,
        metadata: fieldMetadata[key],
        value: formatValue(value),
      }));
  }, [data]);

  return (
    <section style={{ marginTop: '32px' }}>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">APP GOTO GYM</h2>
        <p className="gtg-section-desc">Contenido dinámico extraído desde el backend usando JWT.</p>
      </div>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {loading && (
          <div className="gtg-panel-card" style={{ minHeight: '180px' }}>
            <p>Cargando información de APP GOTO GYM...</p>
          </div>
        )}

        {!loading && forbidden && (
          <div className="gtg-panel-card" style={{ minHeight: '180px' }}>
            <p style={{ color: '#dc2626' }}>
              No tienes permisos para ver la sección APP GOTO GYM. Verifica tu sesión JWT.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="gtg-panel-card" style={{ minHeight: '180px' }}>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {!loading && !error && !forbidden && cards.length === 0 && (
          <div className="gtg-panel-card" style={{ minHeight: '180px' }}>
            <p>No hay información disponible para mostrar en APP GOTO GYM.</p>
          </div>
        )}

        {!loading && cards.map(card => (
          <DynamicInfoCard
            key={card.key}
            title={card.metadata.title}
            value={card.value}
            description={card.metadata.description}
            status={card.metadata.status}
            icon={card.metadata.icon}
            detail={card.value.length > 120 ? card.value : undefined}
          />
        ))}
      </div>
    </section>
  );
};
