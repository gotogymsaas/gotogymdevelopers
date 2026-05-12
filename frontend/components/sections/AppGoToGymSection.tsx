import React from 'react';
import { useCoachContext } from '../../hooks/useCoachContext';
import { getUserEmail } from '../../auth/rbac';
import { DynamicInfoCard } from './DynamicInfoCard';

interface AppGoToGymSectionProps {
  username?: string;
}

export const AppGoToGymSection: React.FC<AppGoToGymSectionProps> = ({ username }) => {
  const userEmail = getUserEmail();

  // Solo mostrar para user@test.com
  if (userEmail !== 'user@test.com') {
    return null;
  }

  const { context, loading, error, status, reload } = useCoachContext({
    username,
    includeText: true,
  });

  const renderCards = () => {
    if (!context) return null;

    const cards = [];

    // wellbeing_experience_value_v1
    if (context.wellbeing_experience_value_v1 !== undefined) {
      cards.push(
        <DynamicInfoCard
          key="wellbeing-experience"
          title="Wellbeing Experience Value"
          value={context.wellbeing_experience_value_v1}
          description="Valor de experiencia de bienestar calculado dinámicamente"
          status="success"
          icon="💚"
          expandable
          expandedContent={<p>Este valor representa tu nivel actual de bienestar basado en métricas personalizadas.</p>}
        />
      );
    }

    // experience_value_pack
    if (context.experience_value_pack) {
      cards.push(
        <DynamicInfoCard
          key="experience-pack"
          title="Experience Value Pack"
          value={context.experience_value_pack}
          description="Paquete de valor de experiencia disponible"
          status="info"
          icon="📦"
        />
      );
    }

    // portfolio_summary
    if (context.portfolio_summary) {
      cards.push(
        <DynamicInfoCard
          key="portfolio-summary"
          title="Portfolio Summary"
          value={context.portfolio_summary}
          description="Resumen de tu portfolio de bienestar"
          status="info"
          icon="📊"
          expandable
          expandedContent={<p>Información detallada sobre tu progreso y logros en el programa de bienestar.</p>}
        />
      );
    }

    // if_variable_payload (asumiendo que es un objeto o string)
    if (context.if_variable_payload) {
      const payloadValue = typeof context.if_variable_payload === 'object'
        ? JSON.stringify(context.if_variable_payload, null, 2)
        : String(context.if_variable_payload);

      cards.push(
        <DynamicInfoCard
          key="variable-payload"
          title="Variable Payload"
          value={payloadValue.length > 50 ? `${payloadValue.substring(0, 50)}...` : payloadValue}
          description="Datos variables dinámicos del contexto"
          status="warning"
          icon="🔄"
          expandable
          expandedContent={<pre className="gtg-json-content">{payloadValue}</pre>}
        />
      );
    }

    // global_wellbeing
    if (context.global_wellbeing) {
      cards.push(
        <DynamicInfoCard
          key="global-wellbeing"
          title="Global Wellbeing"
          value={context.global_wellbeing}
          description="Estado global de bienestar"
          status="success"
          icon="🌟"
        />
      );
    }

    return cards.length > 0 ? (
      <div className="gtg-app-gym-grid">
        {cards}
      </div>
    ) : (
      <div className="gtg-empty-state">
        <p>No hay información disponible para mostrar.</p>
      </div>
    );
  };

  return (
    <section>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </span>
          APP GOTO GYM
        </h2>
        <p className="gtg-section-desc">Información dinámica de bienestar desde el backend de producción.</p>
      </div>

      <div className="gtg-panel-card">
        {loading ? (
          <p>Cargando información de APP GOTO GYM…</p>
        ) : error ? (
          <div className={`gtg-alert ${status === 'forbidden' ? 'gtg-alert-warning' : 'gtg-alert-error'}`}>
            {error}
            {status === 'fallback' && (
              <button onClick={reload} className="gtg-btn gtg-btn-secondary">
                Reintentar
              </button>
            )}
          </div>
        ) : (
          renderCards()
        )}
      </div>
    </section>
  );
};