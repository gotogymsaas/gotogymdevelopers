import React, { useMemo, useState } from 'react';
import { useCorporateWellbeing } from '../../hooks/useCorporateWellbeing';

type RecordValue = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordValue =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const toText = (value: unknown, fallback = 'No disponible'): string => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No';
  }

  return fallback;
};

const formatPercent = (value: unknown): string => {
  const number = toNumber(value);
  return number === null ? '--' : `${Math.round(number)}%`;
};

const formatScore = (value: unknown, suffix = ''): string => {
  const number = toNumber(value);
  if (number === null) {
    return '--';
  }

  return `${Number.isInteger(number) ? number : number.toFixed(1)}${suffix}`;
};

const formatDate = (value: unknown): string => {
  if (typeof value !== 'string' || !value) {
    return 'Sin fecha';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
};

const getNestedRecord = (source: unknown, key: string): RecordValue =>
  isRecord(source) && isRecord(source[key]) ? source[key] : {};

const getArray = (source: unknown, key: string): unknown[] =>
  isRecord(source) && Array.isArray(source[key]) ? source[key] : [];

const compactSummary = (value: unknown): string => {
  if (!isRecord(value)) {
    return toText(value);
  }

  return Object.entries(value)
    .filter(([, item]) => item !== null && item !== undefined && item !== '')
    .slice(0, 4)
    .map(([key, item]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(item) ? item.length : toText(item)}`)
    .join(' · ');
};

const safeDimensions = (value: unknown): RecordValue[] =>
  Array.isArray(value) ? value.filter(isRecord).slice(0, 8) : [];

const riskTone = (severity: string): string => {
  const normalized = severity.toLowerCase();
  if (normalized.includes('high') || normalized.includes('alto') || normalized.includes('crit')) {
    return 'is-high';
  }
  if (normalized.includes('medium') || normalized.includes('medio')) {
    return 'is-medium';
  }
  return 'is-low';
};

interface ExecutiveMetric {
  label: string;
  value: string;
  detail: string;
  tone: string;
}

export const BusinessWellbeingSection: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data, loading, error, reload } = useCorporateWellbeing({ days });

  const workspace = data?.workspace ?? {};
  const sharingPolicy = data?.sharing_policy ?? {};
  const globalWellbeing = data?.global_wellbeing ?? {};
  const ifAggregate = data?.if_variable_aggregate ?? {};
  const experience = data?.experience_intelligence ?? {};
  const activeBreaks = data?.active_breaks_corporate ?? {};
  const riskMap = data?.risk_map ?? {};
  const analysis = data?.corporate_wellbeing_analysis ?? {};
  const coverage = getNestedRecord(activeBreaks, 'coverage');
  const kpis = getNestedRecord(activeBreaks, 'kpis');
  const impact = getNestedRecord(analysis, 'impact_perspective');
  const watchlist = getArray(riskMap, 'watchlist').filter(isRecord).slice(0, 5);
  const recommendedActions = getArray(analysis, 'recommended_actions').slice(0, 5);
  const insights = Array.isArray(data?.insights) ? data.insights.slice(0, 6) : [];
  const dimensions = safeDimensions(ifAggregate.dimensions);
  const riskDimensions = safeDimensions(ifAggregate.risk_dimensions);
  const strengthDimensions = safeDimensions(ifAggregate.strength_dimensions);

  const executiveMetrics = useMemo<ExecutiveMetric[]>(() => [
    {
      label: 'Indice corporativo',
      value: formatScore(globalWellbeing.wellbeing_index_0_100, '%'),
      detail: `${formatScore(globalWellbeing.samples)} muestras`,
      tone: 'teal',
    },
    {
      label: 'Activacion',
      value: formatPercent(globalWellbeing.activation_rate_pct ?? impact.activation_rate_pct),
      detail: `${toText(globalWellbeing.scope, 'programa activo')}`,
      tone: 'gold',
    },
    {
      label: 'Recurrencia',
      value: formatPercent(globalWellbeing.recurrent_rate_pct ?? impact.engagement_rate_pct),
      detail: `${days} dias analizados`,
      tone: 'violet',
    },
    {
      label: 'Pausas completadas',
      value: formatScore(kpis.month_done_total),
      detail: `${formatScore(kpis.completed_pauses_7d_total)} en 7 dias`,
      tone: 'green',
    },
  ], [days, globalWellbeing, impact, kpis]);

  const handleDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDays = Number(event.target.value);
    setDays(nextDays);
    reload({ days: nextDays });
  };

  return (
    <section className="gtg-business-wellbeing">
      <div className="gtg-business-hero">
        <div>
          <span className="gtg-business-kicker">Bienestar corporativo</span>
          <h1>{toText(workspace.organization_name, 'Panel empresarial GoToGym')}</h1>
          <p>
            Lectura ejecutiva agregada para tomar decisiones de activacion, pausas activas,
            recurrencia y salud organizacional sin exponer datos personales de empleados.
          </p>
          <div className="gtg-business-controls">
            <label htmlFor="business-days">Ventana</label>
            <select id="business-days" value={days} onChange={handleDaysChange}>
              <option value={7}>7 dias</option>
              <option value={30}>30 dias</option>
              <option value={90}>90 dias</option>
              <option value={180}>180 dias</option>
            </select>
            <button type="button" onClick={() => reload()} disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        <aside className="gtg-business-command-card">
          <span>Contrato</span>
          <strong>{toText(data?.contract, 'wellbeing_corporativo_business_v1')}</strong>
          <p>Generado: {formatDate(data?.generated_at)}</p>
          <div>
            <small>Politica</small>
            <b>{sharingPolicy.cohort_protected ? 'Cohorte protegida' : 'Detalle agregado habilitado'}</b>
          </div>
        </aside>
      </div>

      {loading && (
        <div className="gtg-business-state">Cargando tablero corporativo...</div>
      )}

      {!loading && error && (
        <div className="gtg-business-state is-error">{error}</div>
      )}

      {!loading && !error && data && (
        <>
          <div className="gtg-business-metrics-grid">
            {executiveMetrics.map(metric => (
              <article className={`gtg-business-metric ${metric.tone}`} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>

          <div className="gtg-business-layout">
            <article className="gtg-business-panel gtg-business-program">
              <div className="gtg-business-panel-head">
                <span>Estado del programa</span>
                <strong>{toText(analysis.status_program, 'En observacion')}</strong>
              </div>
              <p>{toText(analysis.analysis_summary, 'No hay resumen ejecutivo disponible.')}</p>
              <div className="gtg-business-impact-grid">
                <span>Riesgo negocio <b>{toText(impact.business_risk_level, '--')}</b></span>
                <span>Engagement <b>{formatPercent(impact.engagement_rate_pct)}</b></span>
                <span>Miembros activos <b>{formatScore(coverage.members_in_scope_legal)}</b></span>
                <span>Actividad 7d <b>{formatScore(coverage.members_with_activity_7d)}</b></span>
              </div>
            </article>

            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Pausas activas SG-SST</span>
                <strong>{formatPercent(kpis.avg_adherence_7d)}</strong>
              </div>
              <div className="gtg-business-progress-list">
                <div>
                  <span>Asistencia mensual</span>
                  <b>{formatPercent(kpis.avg_attendance_month_pct)}</b>
                </div>
                <div>
                  <span>Completitud legal</span>
                  <b>{formatPercent(kpis.avg_legal_event_completeness_pct)}</b>
                </div>
                <div>
                  <span>Duracion en rango</span>
                  <b>{formatPercent(kpis.avg_month_duration_in_range_pct)}</b>
                </div>
              </div>
            </article>
          </div>

          <div className="gtg-business-layout">
            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Variables IF</span>
                <strong>{formatPercent(ifAggregate.coverage_pct)}</strong>
              </div>
              {ifAggregate.cohort_protected ? (
                <p>{toText(ifAggregate.message, 'Detalle oculto por proteccion de cohorte minima.')}</p>
              ) : (
                <div className="gtg-business-dimension-grid">
                  {dimensions.map((dimension, index) => (
                    <div className="gtg-business-dimension" key={`${toText(dimension.question_id, 'dim')}-${index}`}>
                      <span>{toText(dimension.question_label ?? dimension.question_id, 'Variable')}</span>
                      <strong>{formatScore(dimension.avg_score_0_10, '/10')}</strong>
                      <small>Bajo {formatPercent(dimension.low_share_pct)} · Alto {formatPercent(dimension.high_share_pct)}</small>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Mapa de riesgos</span>
                <strong>{watchlist.length}</strong>
              </div>
              <div className="gtg-business-watchlist">
                {watchlist.length > 0 ? watchlist.map((item, index) => (
                  <div className={`gtg-business-risk ${riskTone(toText(item.severity, 'low'))}`} key={`${toText(item.code, 'risk')}-${index}`}>
                    <span>{toText(item.code, 'Alerta')}</span>
                    <p>{toText(item.message ?? item.detail, compactSummary(item))}</p>
                  </div>
                )) : (
                  <p>No hay alertas prioritarias en la ventana seleccionada.</p>
                )}
              </div>
            </article>
          </div>

          <div className="gtg-business-three-col">
            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Fortalezas</span>
                <strong>{strengthDimensions.length}</strong>
              </div>
              <ul className="gtg-business-list">
                {strengthDimensions.length > 0 ? strengthDimensions.map((item, index) => (
                  <li key={`${toText(item.question_id, 'strength')}-${index}`}>
                    <b>{toText(item.question_label ?? item.question_id)}</b>
                    <span>{formatScore(item.avg_score_0_10, '/10')}</span>
                  </li>
                )) : <li>No hay fortalezas disponibles.</li>}
              </ul>
            </article>

            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Prioridades</span>
                <strong>{riskDimensions.length}</strong>
              </div>
              <ul className="gtg-business-list">
                {riskDimensions.length > 0 ? riskDimensions.map((item, index) => (
                  <li key={`${toText(item.question_id, 'risk-dim')}-${index}`}>
                    <b>{toText(item.question_label ?? item.question_id)}</b>
                    <span>{formatScore(item.avg_score_0_10, '/10')}</span>
                  </li>
                )) : <li>No hay prioridades disponibles.</li>}
              </ul>
            </article>

            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Experiencias</span>
                <strong>{formatScore(experience.total_events)}</strong>
              </div>
              <p>
                Usuarios activos: {formatScore(experience.active_users)} · Promedio por activo:
                {' '}{formatScore(experience.avg_events_per_active)}
              </p>
              <small>{compactSummary(experience)}</small>
            </article>
          </div>

          <div className="gtg-business-layout">
            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Acciones recomendadas</span>
                <strong>{recommendedActions.length}</strong>
              </div>
              <ul className="gtg-business-action-list">
                {recommendedActions.length > 0 ? recommendedActions.map((action, index) => (
                  <li key={`${toText(action, 'action')}-${index}`}>{toText(action)}</li>
                )) : <li>No hay acciones recomendadas disponibles.</li>}
              </ul>
            </article>

            <article className="gtg-business-panel">
              <div className="gtg-business-panel-head">
                <span>Insights</span>
                <strong>{insights.length}</strong>
              </div>
              <div className="gtg-business-insights">
                {insights.length > 0 ? insights.map((insight, index) => (
                  <span key={`${compactSummary(insight)}-${index}`}>{compactSummary(insight)}</span>
                )) : <p>No hay insights disponibles.</p>}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
};
