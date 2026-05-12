import React from 'react';
import { useCoachContext } from '../../hooks/useCoachContext';

interface CoachContextSectionProps {
  username?: string;
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'No disponible';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export const CoachContextSection: React.FC<CoachContextSectionProps> = ({ username }) => {
  const { context, loading, error, status, reload } = useCoachContext({
    username,
    includeText: true,
  });

  return (
    <section>
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">Contexto de Coach</h2>
        <p className="gtg-section-desc">Información de wellbeing proveniente del endpoint protegido.</p>
      </div>

      <div className="gtg-panel-card">
        {loading ? (
          <p>Cargando contexto de coach…</p>
        ) : (
          <div className="gtg-context-grid">
            <div>
              <strong>Global Wellbeing</strong>
              <p>{context?.global_wellbeing ?? 'No disponible'}</p>
            </div>
            <div>
              <strong>Generado</strong>
              <p>{formatDateTime(context?.generated_at)}</p>
            </div>
            <div>
              <strong>Portfolio Summary</strong>
              <p>{context?.portfolio_summary ?? 'No disponible'}</p>
            </div>
            <div>
              <strong>Experience Value Pack</strong>
              <p>{context?.experience_value_pack ?? 'No disponible'}</p>
            </div>
          </div>
        )}

        {error && (
          <div className={`gtg-alert ${status === 'forbidden' ? 'gtg-alert-warning' : 'gtg-alert-error'}`}>
            {error}
            {status === 'fallback' && (
              <button onClick={reload} className="gtg-btn gtg-btn-secondary">
                Reintentar
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
