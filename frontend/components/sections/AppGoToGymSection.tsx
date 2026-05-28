import React, { useMemo } from 'react';
import type { CoachContextResponse } from '../../src/services/wellbeingService';

interface AppGoToGymSectionProps {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
}

interface BmiCategory {
  label: string;
  range: string;
  min: number;
  max: number;
  color: string;
}

const bmiCategories: BmiCategory[] = [
  { label: 'Delgadez severa', range: '< 16.0', min: 0, max: 15.99, color: '#1495f7' },
  { label: 'Delgadez moderada', range: '16.0 - 16.9', min: 16, max: 16.99, color: '#46c6f0' },
  { label: 'Bajo peso', range: '17.0 - 18.4', min: 17, max: 18.49, color: '#9371dd' },
  { label: 'Normal', range: '18.5 - 24.9', min: 18.5, max: 24.99, color: '#24d98c' },
  { label: 'Sobrepeso', range: '25.0 - 29.9', min: 25, max: 29.99, color: '#ffc51d' },
  { label: 'Obesidad clase I', range: '30.0 - 34.9', min: 30, max: 34.99, color: '#ff5a40' },
  { label: 'Obesidad clase II', range: '35.0 - 39.9', min: 35, max: 39.99, color: '#f12c5f' },
  { label: 'Obesidad clase III', range: '40.0 <', min: 40, max: Number.POSITIVE_INFINITY, color: '#dd0038' },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const formatDecimal = (value: number, digits = 1): string =>
  new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const normalizeHeightMeters = (height: number | null): number | null => {
  if (!height || height <= 0) {
    return null;
  }

  return height > 3 ? height / 100 : height;
};

const getBmiCategory = (bmi: number | null): BmiCategory | null => {
  if (bmi === null) {
    return null;
  }

  return bmiCategories.find(category => bmi >= category.min && bmi <= category.max) ?? null;
};

const getBmiNeedleRotation = (bmi: number | null): number => {
  if (bmi === null) {
    return -120;
  }

  const min = 12;
  const max = 42;
  const clamped = Math.min(max, Math.max(min, bmi));
  return -120 + ((clamped - min) / (max - min)) * 240;
};

const getHappinessValue = (data: CoachContextResponse | null): number | null => {
  const profile = data?.profile;
  const wellbeing = data?.wellbeing_experience_value_v1?.global_wellbeing;

  const profileValue = isRecord(profile) ? readNumber(profile.happiness_index) : null;
  const wellbeingValue = isRecord(wellbeing) ? readNumber(wellbeing.happiness_index) : null;
  const value = profileValue ?? wellbeingValue;

  if (value === null) {
    return null;
  }

  return value <= 1 ? value * 100 : Math.min(100, value);
};

const getHappinessMessage = (value: number | null): string => {
  if (value === null) {
    return 'Esperando tu indice de bienestar';
  }

  if (value >= 80) {
    return 'Estas radiante hoy';
  }

  if (value >= 60) {
    return 'Vas con buena energia';
  }

  if (value >= 40) {
    return 'Hay espacio para recargar';
  }

  return 'Tu bienestar necesita atencion';
};

const formatBadges = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'string') {
          return item;
        }

        if (isRecord(item)) {
          const label = item.label ?? item.name ?? item.title ?? item.id;
          return typeof label === 'string' ? label : null;
        }

        return null;
      })
      .filter((item): item is string => Boolean(item?.trim()))
      .slice(0, 4);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key)
      .slice(0, 4);
  }

  return [];
};

const describeActiveBreaks = (value: unknown): string => {
  if (!value) {
    return 'Sin memoria de pausas activas registrada.';
  }

  if (typeof value === 'string') {
    return value.trim() || 'Sin memoria de pausas activas registrada.';
  }

  if (isRecord(value)) {
    const candidates = [
      value.summary,
      value.last_recommendation,
      value.last_action,
      value.status,
      value.preference,
    ];
    const found = candidates.find(candidate => typeof candidate === 'string' && candidate.trim());

    if (typeof found === 'string') {
      return found;
    }

    const keys = Object.keys(value);
    return keys.length
      ? `Memoria activa con ${keys.length} datos guardados.`
      : 'Sin memoria de pausas activas registrada.';
  }

  return 'Memoria de pausas activas disponible.';
};

export const AppGoToGymSection: React.FC<AppGoToGymSectionProps> = ({
  data,
  loading,
  error,
  forbidden,
}) => {
  const profile = isRecord(data?.profile) ? data?.profile : {};

  const wellness = useMemo(() => {
    const weight = readNumber(profile.weight);
    const heightMeters = normalizeHeightMeters(readNumber(profile.height));
    const bmi = weight !== null && heightMeters !== null
      ? weight / (heightMeters * heightMeters)
      : null;
    const category = getBmiCategory(bmi);
    const happiness = getHappinessValue(data);
    const streak = readNumber(profile.current_streak);
    const badges = formatBadges(profile.badges);
    const activeBreaks = describeActiveBreaks(profile.active_breaks_memory);

    return {
      weight,
      heightMeters,
      bmi,
      category,
      happiness,
      happinessMessage: getHappinessMessage(happiness),
      streak,
      badges,
      activeBreaks,
    };
  }, [data, profile]);

  return (
    <section className="gtg-wellness-widgets-section">
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">APP GOTO GYM</h2>
      </div>

      {loading && (
        <div className="gtg-app-gym-status">Cargando informacion de bienestar...</div>
      )}

      {!loading && forbidden && (
        <div className="gtg-app-gym-status is-error">No tienes permisos para ver APP GOTO GYM.</div>
      )}

      {!loading && !forbidden && error && (
        <div className="gtg-app-gym-status is-error">{error}</div>
      )}

      {!loading && !forbidden && !error && (
        <div className="gtg-wellness-widgets-grid">
          <article className="gtg-bmi-widget">
            <h3>Calculadora de IMC</h3>

            <div className="gtg-bmi-input-row">
              <div className="gtg-bmi-input-card">
                <strong>{wellness.weight !== null ? `${formatDecimal(wellness.weight, 1)} kg` : 'Sin dato'}</strong>
                <span>Peso</span>
              </div>
              <div className="gtg-bmi-input-card">
                <strong>{wellness.heightMeters !== null ? `${Math.round(wellness.heightMeters * 100)} cm` : 'Sin dato'}</strong>
                <span>Estatura</span>
              </div>
            </div>

            <div className="gtg-bmi-gauge" style={{ '--bmi-needle-rotation': `${getBmiNeedleRotation(wellness.bmi)}deg` } as React.CSSProperties}>
              <div className="gtg-bmi-arc" aria-hidden="true" />
              <div className="gtg-bmi-person" aria-hidden="true" />
              <div className="gtg-bmi-needle" aria-hidden="true" />
              <div className="gtg-bmi-value">
                <strong>{wellness.bmi !== null ? formatDecimal(wellness.bmi, 1) : '--'}</strong>
                <span>IMC</span>
              </div>
            </div>

            <ul className="gtg-bmi-scale" aria-label="Clasificacion IMC">
              {bmiCategories.map(category => (
                <li
                  className={wellness.category?.label === category.label ? 'is-active' : ''}
                  key={category.label}
                >
                  <span className="gtg-bmi-dot" style={{ backgroundColor: category.color }} />
                  <span className="gtg-bmi-label">{category.label}</span>
                  <strong>{category.range}</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className="gtg-happiness-widget">
            <div>
              <h3>Indice de felicidad</h3>
              <p>{wellness.happinessMessage}</p>
            </div>
            <div
              className="gtg-happiness-ring"
              style={{ '--happiness-value': `${wellness.happiness ?? 0}%` } as React.CSSProperties}
              aria-label={`Indice de felicidad ${wellness.happiness !== null ? Math.round(wellness.happiness) : 0}%`}
            >
              <div className="gtg-happiness-heart" aria-hidden="true" />
              <strong>{wellness.happiness !== null ? `${Math.round(wellness.happiness)}%` : '--'}</strong>
            </div>
            <span className="gtg-happiness-source">happiness_index</span>
          </article>

          <article className="gtg-progress-widget">
            <div className="gtg-progress-header">
              <span>Progreso personal</span>
              <strong>{wellness.streak !== null ? `${Math.round(wellness.streak)} dias` : 'Sin racha'}</strong>
            </div>

            <div className="gtg-progress-main">
              <div className="gtg-progress-stat">
                <span>Racha actual</span>
                <strong>{wellness.streak !== null ? Math.round(wellness.streak) : '--'}</strong>
                <small>dias consecutivos</small>
              </div>
              <div className="gtg-progress-breaks">
                <span>Pausas activas</span>
                <p>{wellness.activeBreaks}</p>
              </div>
            </div>

            <div className="gtg-progress-badges">
              <span>Insignias y logros</span>
              {wellness.badges.length > 0 ? (
                <div className="gtg-progress-badge-list">
                  {wellness.badges.map(badge => (
                    <strong key={badge}>{badge}</strong>
                  ))}
                </div>
              ) : (
                <p>Aun no hay insignias registradas.</p>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
};
