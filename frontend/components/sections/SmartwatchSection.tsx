import React from 'react';
import type { SmartwatchMetric, SmartwatchMetricId } from '../../types/types';
import { smartwatchMetricDetailsMock } from '../../mocks/smartwatchMetrics';
import { SmartwatchGrid } from './SmartwatchGrid';

interface SmartwatchSectionProps {
  metrics: SmartwatchMetric[];
  loading?: boolean;
  error?: string | null;
  dataSource?: 'api' | 'mock';
  onRetry?: () => void;
  preferredMetricId?: SmartwatchMetricId | null;
}

export const SmartwatchSection: React.FC<SmartwatchSectionProps> = ({
  metrics,
  loading = false,
  error = null,
  dataSource = 'mock',
  onRetry,
  preferredMetricId = null,
}) => {
  return (
    <section className="gtg-smartwatch-section">
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">
          <span className="gtg-section-title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="2" width="10" height="20" rx="3" />
              <line x1="9" y1="6" x2="15" y2="6" />
            </svg>
          </span>
          Smartwatch
        </h2>
        <p className="gtg-section-desc">Resumen de salud y metricas diarias simuladas para el usuario final</p>
        <div className="gtg-smartwatch-status-row">
          <span className={`gtg-badge ${dataSource === 'api' ? 'connected' : 'pending_review'}`}>
            Fuente: {dataSource === 'api' ? 'API' : 'Mock'}
          </span>
          {loading && <span className="gtg-smartwatch-loading">Actualizando metricas...</span>}
          {!loading && onRetry && (
            <button type="button" className="gtg-table-action-btn" onClick={onRetry}>
              Actualizar
            </button>
          )}
        </div>
        {error && <p className="gtg-smartwatch-error">{error}</p>}
      </div>

      <SmartwatchGrid
        metrics={metrics}
        detailsByMetric={smartwatchMetricDetailsMock}
        preferredMetricId={preferredMetricId}
      />
    </section>
  );
};