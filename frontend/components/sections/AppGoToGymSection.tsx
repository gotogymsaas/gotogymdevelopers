import React, { useMemo } from 'react';
import type { CoachContextResponse } from '../../src/services/wellbeingService';

interface AppGoToGymSectionProps {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
}

interface DynamicItem {
  key: string;
  label: string;
  value: unknown;
  type: 'metric' | 'text' | 'list' | 'object';
}

interface DynamicSegment {
  id: string;
  title: string;
  description: string;
  items: DynamicItem[];
}

const labelMap: Record<string, string> = {
  username: 'Usuario',
  email: 'Email',
  plan: 'Plan',
  account_type: 'Tipo de cuenta',
  full_name: 'Nombre',
  timezone: 'Zona horaria',
  sex: 'Sexo',
  age: 'Edad',
  weight: 'Peso',
  height: 'Altura',
  profession: 'Profesion',
  favorite_exercise_time: 'Horario favorito',
  favorite_sport: 'Deporte favorito',
  goal_type: 'Objetivo',
  activity_level: 'Nivel de actividad',
  happiness_index: 'Indice de felicidad',
  current_streak: 'Racha actual',
  week_id: 'Semana',
  generated_at: 'Generado en',
  contract: 'Contrato',
  connected_providers: 'Proveedores conectados',
  count: 'Cantidad',
  types: 'Tipos',
  has_business_workspace: 'Workspace empresarial',
  active_workspace: 'Workspace activo',
  global_wellbeing: 'Bienestar global',
  if_variable_payload: 'Variables IF',
  experience_value_pack: 'Valor de experiencia',
  portfolio_summary: 'Resumen de portafolio',
  guardrails: 'Guardrails',
  scores: 'Scores',
  qualitative_interpretation: 'Interpretacion cualitativa',
  latest_record: 'Ultimo registro',
  answers: 'Respuestas',
  devices: 'Dispositivos',
  fitness: 'Datos fitness',
  summary: 'Resumen',
  active_breaks_memory: 'Memoria de pausas activas',
};

const segmentOrder: Array<{
  id: string;
  title: string;
  description: string;
  read: (data: CoachContextResponse) => unknown;
}> = [
  {
    id: 'profile',
    title: 'Perfil del usuario',
    description: 'Datos base del usuario autenticado recibidos desde el servicio de bienestar.',
    read: data => data.profile,
  },
  {
    id: 'wellbeing',
    title: 'Bienestar global',
    description: 'Indicadores calculados por el contrato wellbeing_experience_value_v1.',
    read: data => data.wellbeing_experience_value_v1,
  },
  {
    id: 'if-snapshot',
    title: 'Indice de felicidad y variables IF',
    description: 'Scores, respuestas y lectura cualitativa mas reciente.',
    read: data => data.if_snapshot,
  },
  {
    id: 'devices',
    title: 'Dispositivos y datos conectados',
    description: 'Estado de dispositivos y ultimos datos de fitness asociados al usuario.',
    read: data => data.devices,
  },
  {
    id: 'documents',
    title: 'Documentos del usuario',
    description: 'Documentos disponibles para contexto de bienestar.',
    read: data => data.documents,
  },
  {
    id: 'business',
    title: 'Contexto empresarial',
    description: 'Workspaces y permisos empresariales asociados, si existen.',
    read: data => data.business,
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (typeof value === 'number') {
    return !Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.length === 0 || value.every(isEmptyValue);
  }

  if (isRecord(value)) {
    return Object.values(value).every(isEmptyValue);
  }

  return false;
};

const titleize = (key: string): string =>
  labelMap[key] ?? key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

const getItemType = (value: unknown): DynamicItem['type'] => {
  if (Array.isArray(value)) {
    return 'list';
  }

  if (isRecord(value)) {
    return 'object';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return 'metric';
  }

  return 'text';
};

const getPrimaryItems = (source: unknown): DynamicItem[] => {
  if (!isRecord(source)) {
    return [];
  }

  return Object.entries(source)
    .filter(([, value]) => !isEmptyValue(value))
    .map(([key, value]) => ({
      key,
      label: titleize(key),
      value,
      type: getItemType(value),
    }));
};

const buildSegments = (data: CoachContextResponse | null): DynamicSegment[] => {
  if (!data) {
    return [];
  }

  return segmentOrder
    .map(segment => ({
      id: segment.id,
      title: segment.title,
      description: segment.description,
      items: getPrimaryItems(segment.read(data)),
    }))
    .filter(segment => segment.items.length > 0);
};

const formatPrimitive = (value: unknown): string => {
  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime()) && /\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: value.includes('T') ? 'short' : undefined,
      }).format(date);
    }

    return value;
  }

  return String(value);
};

const summarizeObject = (value: Record<string, unknown>): string => {
  const entries = Object.entries(value).filter(([, entryValue]) => !isEmptyValue(entryValue));
  if (entries.length === 0) {
    return '';
  }

  return entries
    .slice(0, 4)
    .map(([key, entryValue]) => {
      if (Array.isArray(entryValue)) {
        return `${titleize(key)}: ${entryValue.length}`;
      }

      if (isRecord(entryValue)) {
        return `${titleize(key)}: ${Object.keys(entryValue).length} datos`;
      }

      return `${titleize(key)}: ${formatPrimitive(entryValue)}`;
    })
    .join(' · ');
};

const renderValue = (item: DynamicItem) => {
  if (item.type === 'list' && Array.isArray(item.value)) {
    const visibleItems = item.value.filter(value => !isEmptyValue(value)).slice(0, 5);
    return (
      <ul className="gtg-dynamic-list">
        {visibleItems.map((value, index) => (
          <li key={`${item.key}-${index}`}>
            {isRecord(value) ? summarizeObject(value) : formatPrimitive(value)}
          </li>
        ))}
      </ul>
    );
  }

  if (item.type === 'object' && isRecord(item.value)) {
    const entries = Object.entries(item.value).filter(([, value]) => !isEmptyValue(value));
    return (
      <div className="gtg-dynamic-object">
        {entries.slice(0, 8).map(([key, value]) => (
          <span key={`${item.key}-${key}`}>
            <strong>{titleize(key)}</strong>
            {Array.isArray(value) ? `${value.length} items` : isRecord(value) ? summarizeObject(value) : formatPrimitive(value)}
          </span>
        ))}
      </div>
    );
  }

  return <strong className="gtg-dynamic-value">{formatPrimitive(item.value)}</strong>;
};

export const AppGoToGymSection: React.FC<AppGoToGymSectionProps> = ({
  data,
  loading,
  error,
  forbidden,
}) => {
  const segments = useMemo(() => buildSegments(data), [data]);
  const generatedAt = data?.wellbeing_experience_value_v1?.generated_at;

  return (
    <section className="gtg-app-gym-section gtg-app-gym-dynamic">
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">APP GOTO GYM</h2>
        <p className="gtg-section-desc">
          Modulo informativo construido en tiempo real desde el endpoint de bienestar.
        </p>
        {generatedAt ? (
          <span className="gtg-dynamic-live-pill">
            Actualizado {formatPrimitive(generatedAt)}
          </span>
        ) : null}
      </div>

      {loading && (
        <div className="gtg-app-gym-status">Cargando informacion de APP GOTO GYM...</div>
      )}

      {!loading && forbidden && (
        <div className="gtg-app-gym-status is-error">No tienes permisos para ver APP GOTO GYM.</div>
      )}

      {!loading && !forbidden && error && (
        <div className="gtg-app-gym-status is-error">{error}</div>
      )}

      {!loading && !forbidden && !error && segments.length === 0 && (
        <div className="gtg-app-gym-status">El endpoint de bienestar no trae informacion disponible para mostrar.</div>
      )}

      {!loading && !forbidden && !error && segments.length > 0 && (
        <div className="gtg-dynamic-segments">
          {segments.map(segment => (
            <article className="gtg-dynamic-segment" key={segment.id}>
              <div className="gtg-dynamic-segment-head">
                <div>
                  <h3>{segment.title}</h3>
                  <p>{segment.description}</p>
                </div>
                <span>{segment.items.length} datos</span>
              </div>

              <div className="gtg-dynamic-grid">
                {segment.items.map(item => (
                  <div
                    className={`gtg-dynamic-card is-${item.type}`}
                    key={`${segment.id}-${item.key}`}
                  >
                    <span className="gtg-dynamic-label">{item.label}</span>
                    {renderValue(item)}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
