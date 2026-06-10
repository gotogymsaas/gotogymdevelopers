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
  description?: string;
  value: unknown;
  type: 'metric' | 'text' | 'list' | 'object';
}

interface DynamicSegment {
  id: string;
  title: string;
  description: string;
  items: DynamicItem[];
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

const labelMap: Record<string, string> = {
  username: 'Usuario',
  email: 'Correo',
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
  guardrails: 'Reglas de proteccion',
  scores: 'Puntajes',
  qualitative_interpretation: 'Interpretacion cualitativa',
  latest_record: 'Ultimo registro',
  answers: 'Respuestas',
  devices: 'Dispositivos',
  fitness: 'Datos fitness',
  summary: 'Resumen',
  active_breaks_memory: 'Memoria de pausas activas',
  answered_questions: 'Variables respondidas',
  responses: 'Variables de bienestar respondidas',
  top_scores: 'Fortalezas',
  low_scores: 'Prioridades de mejora',
  score: 'Puntaje',
  question_id: 'Variable',
  question_label: 'Pregunta',
  value: 'Valor',
  slot: 'Momento del dia',
  answered_at: 'Respondido en',
  answered_date: 'Fecha de respuesta',
  source: 'Origen',
  provider: 'Proveedor',
  status: 'Estado',
  last_sync_at: 'Ultima sincronizacion',
  updated_at: 'Actualizado en',
  start_time: 'Inicio del periodo',
  end_time: 'Fin del periodo',
  created_at: 'Creado en',
  metrics: 'Metricas',
  doc_type: 'Tipo de documento',
  file_name: 'Archivo',
  extracted_text: 'Texto extraido',
  workspaces: 'Workspaces',
  organization_name: 'Organizacion',
  organization_status: 'Estado de organizacion',
  organization_plan: 'Plan empresarial',
  role: 'Rol',
  permission_scope: 'Alcance de permisos',
  module_access: 'Modulos habilitados',
  happiness_index: 'Bienestar actual',
  avg_7d: 'Promedio ultimos 7 dias',
  avg_prev_7d: 'Promedio semana anterior',
  delta_7d: 'Cambio semanal',
  records_14d: 'Registros en 14 dias',
  experiences_tracked: 'Experiencias con datos',
  accepted_experiences: 'Experiencias listas',
  average_confidence: 'Confianza promedio',
  analysis_summary: 'Resumen de analisis',
  experience_id: 'Experiencia',
  label: 'Nombre',
  decision: 'Resultado',
  decision_reason: 'Motivo del resultado',
  confidence: 'Confianza',
  value_metrics: 'Metricas de valor',
  share_only_variable_data: 'Solo comparte datos variables',
  static_catalog_excluded: 'Catalogo estatico excluido',
  contains_personal_identifiers: 'Contiene identificadores personales',
  excluded_categories: 'Categorias excluidas',
};

const meaningMap: Record<string, string> = {
  profile: 'Contexto basico del usuario autenticado: plan, preferencias, objetivo y estado del coach.',
  documents: 'Documentos cargados por el usuario. Pueden incluir informacion sensible.',
  devices: 'Conexiones fitness o smartwatch y su ultima sincronizacion.',
  if_snapshot: 'Foto de respuestas y puntajes IF de la semana actual.',
  wellbeing_experience_value_v1: 'Bloque recomendado para pintar cards de bienestar de forma mas segura y funcional.',
  global_wellbeing: 'Estado general de bienestar del usuario.',
  if_variable_payload: 'Variables IF listas para mostrar como cards.',
  experience_value_pack: 'Resultados calculados por experiencias del coach.',
  portfolio_summary: 'Resumen general de experiencias disponibles y nivel de confianza.',
  guardrails: 'Reglas de privacidad y alcance de datos del contrato.',
  happiness_index: 'Bienestar actual. Si viene 0.66, se puede leer como 66%.',
  avg_7d: 'Promedio de bienestar de los ultimos 7 dias.',
  avg_prev_7d: 'Promedio de la semana anterior, si hay historial suficiente.',
  delta_7d: 'Diferencia entre esta semana y la anterior.',
  records_14d: 'Cantidad de registros usados en los ultimos 14 dias.',
  answered_questions: 'Cantidad de variables IF con respuesta valida.',
  responses: 'Lista de variables IF con su puntaje.',
  top_scores: 'Variables mejor calificadas. Representan fortalezas.',
  low_scores: 'Variables con menor puntaje. Representan prioridades de mejora.',
  connected_providers: 'Fuentes conectadas como Google Fit, Fitbit, Garmin o Whoop.',
  fitness: 'Ultima informacion fitness sincronizada por proveedor.',
  active_breaks_memory: 'Memoria especifica de pausas activas guardada por el coach.',
  current_streak: 'Racha actual del usuario.',
  badges: 'Insignias o logros obtenidos.',
  scores: 'Puntajes actuales de variables IF.',
  qualitative_interpretation: 'Lectura estructurada de las variables IF.',
  latest_record: 'Ultimo registro historico de bienestar/felicidad.',
};

const ifVariableMap: Record<string, { name: string; meaning: string }> = {
  s_steps: { name: 'Actividad fisica / pasos', meaning: 'Movimiento diario.' },
  s_sleep: { name: 'Horas de sueno', meaning: 'Duracion del descanso.' },
  s_stress_inv: { name: 'Manejo del estres', meaning: 'Capacidad de regular el estres. Mientras mas alto, mejor manejo.' },
  s_intensity: { name: 'Intensidad de entrenamiento', meaning: 'Nivel de exigencia fisica percibida.' },
  s_emotional: { name: 'Estabilidad emocional', meaning: 'Balance emocional percibido.' },
  s_social: { name: 'Vida social y conexiones', meaning: 'Calidad de las conexiones sociales.' },
  s_hrv: { name: 'Recuperacion / variabilidad cardiaca', meaning: 'Sensacion de recuperacion fisica.' },
  s_bio_age: { name: 'Vitalidad percibida', meaning: 'Energia o edad biologica percibida.' },
  s_sleep_quality: { name: 'Calidad del sueno', meaning: 'Que tan reparador fue el descanso.' },
  s_circadian: { name: 'Rutina circadiana', meaning: 'Regularidad de horarios y ritmo diario.' },
  s_focus: { name: 'Capacidad de enfoque', meaning: 'Concentracion y atencion sostenida.' },
  s_mood_sust: { name: 'Estado de animo sostenido', meaning: 'Estabilidad del animo en el tiempo.' },
  s_flow: { name: 'Estado de flow', meaning: 'Frecuencia de momentos de concentracion profunda.' },
  s_purpose: { name: 'Sentido de proposito', meaning: 'Claridad de sentido, motivacion o direccion personal.' },
  s_hobbies: { name: 'Tiempo para hobbies', meaning: 'Tiempo dedicado a ocio saludable o restaurativo.' },
  s_prosocial: { name: 'Ayuda a otros', meaning: 'Conductas prosociales o de apoyo.' },
};

const experienceMap: Record<string, string> = {
  'exp-002_goal_coherence': 'Coherencia de comida con el objetivo del usuario.',
  'exp-003_metabolic_profile': 'Perfil metabolico semanal.',
  'exp-007_lifestyle_intelligence': 'Inteligencia de estilo de vida.',
  'exp-008_motivation': 'Dinamica motivacional.',
  'exp-009_progression': 'Progresion de entrenamiento o habitos.',
  'exp-005_body_trend': 'Proyeccion de tendencia corporal.',
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

  if (value <= 1) {
    return value * 100;
  }

  if (value <= 10) {
    return value * 10;
  }

  return Math.min(100, value);
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
  ifVariableMap[key]?.name ?? labelMap[key] ?? key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

const getMeaning = (key: string): string | undefined =>
  ifVariableMap[key]?.meaning ?? meaningMap[key];

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
      description: getMeaning(key),
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

const formatPercentLike = (value: unknown): string => {
  const numeric = readNumber(value);
  if (numeric === null) {
    return '--';
  }

  const percent = numeric <= 1 ? numeric * 100 : numeric <= 10 ? numeric * 10 : numeric;
  return `${Math.round(Math.min(100, Math.max(0, percent)))}%`;
};

const getRecordValue = (source: unknown, keys: string[]): unknown => {
  if (!isRecord(source)) {
    return undefined;
  }

  return keys.map(key => source[key]).find(value => !isEmptyValue(value));
};

const getArrayValue = (source: unknown, keys: string[]): unknown[] => {
  const value = getRecordValue(source, keys);
  return Array.isArray(value) ? value : [];
};

const getCountFromValue = (source: unknown, keys: string[]): number | null => {
  const value = getRecordValue(source, keys);
  if (Array.isArray(value)) {
    return value.length;
  }

  if (isRecord(value)) {
    return Object.keys(value).length;
  }

  return readNumber(value);
};

const getScoreTone = (value: unknown): 'is-high' | 'is-mid' | 'is-low' => {
  const score = readNumber(value);
  if (score === null) {
    return 'is-mid';
  }

  const normalized = score <= 1 ? score * 100 : score <= 10 ? score * 10 : score;
  if (normalized >= 72) {
    return 'is-high';
  }

  if (normalized >= 45) {
    return 'is-mid';
  }

  return 'is-low';
};

const summarizeObject = (value: Record<string, unknown>): string => {
  const entries = Object.entries(value).filter(([, entryValue]) => !isEmptyValue(entryValue));
  if (entries.length === 0) {
    return '';
  }

  return entries
    .map(([key, entryValue]) => {
      if (key === 'question_id' && typeof entryValue === 'string') {
        return `${titleize(key)}: ${titleize(entryValue)}`;
      }

      if (key === 'experience_id' && typeof entryValue === 'string') {
        return `${titleize(key)}: ${experienceMap[entryValue] ?? entryValue}`;
      }

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

const normalizeScore = (value: unknown): number | null => {
  const raw = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(raw) ? raw : null;
};

const scoreReading = (score: unknown): string => {
  const normalized = normalizeScore(score);
  if (normalized === null) {
    return 'Sin informacion suficiente.';
  }

  if (normalized >= 1 && normalized <= 3) {
    return 'Lectura: bajo. Prioridad alta de mejora.';
  }

  if (normalized >= 4 && normalized <= 6) {
    return 'Lectura: medio. Hay margen claro de mejora.';
  }

  if (normalized >= 7) {
    return 'Lectura: favorable. Conviene mantener consistencia.';
  }

  return 'Lectura disponible.';
};

const renderIfVariableCard = (value: Record<string, unknown>, index: number) => {
  const questionId = typeof value.question_id === 'string' ? value.question_id : '';
  const variable = ifVariableMap[questionId];
  const score = value.score ?? value.value ?? value.answer;
  const title = variable?.name ?? (questionId || 'Variable de bienestar');

  return (
    <li className="gtg-dynamic-if-item" key={`${questionId}-${index}`}>
      <strong>{title}</strong>
      {score !== undefined && !isEmptyValue(score) ? <span>{formatPrimitive(score)}/10</span> : null}
      <p>{variable?.meaning ?? 'Variable IF de bienestar.'}</p>
      <small>{scoreReading(score)}</small>
    </li>
  );
};

const renderValue = (item: DynamicItem) => {
  if (item.type === 'list' && Array.isArray(item.value)) {
    const visibleItems = item.value.filter(value => !isEmptyValue(value));
    const isIfList = visibleItems.some(value => isRecord(value) && typeof value.question_id === 'string');

    return (
      <ul className="gtg-dynamic-list">
        {visibleItems.map((value, index) => (
          isIfList && isRecord(value)
            ? renderIfVariableCard(value, index)
            : (
              <li key={`${item.key}-${index}`}>
                {isRecord(value) ? summarizeObject(value) : formatPrimitive(value)}
              </li>
            )
        ))}
      </ul>
    );
  }

  if (item.type === 'object' && isRecord(item.value)) {
    const entries = Object.entries(item.value).filter(([, value]) => !isEmptyValue(value));
    return (
      <div className="gtg-dynamic-object">
        {entries.map(([key, value]) => (
          <span key={`${item.key}-${key}`}>
            <strong>{titleize(key)}</strong>
            {getMeaning(key) ? <em>{getMeaning(key)}</em> : null}
            {Array.isArray(value) ? `${value.length} elementos` : isRecord(value) ? summarizeObject(value) : formatPrimitive(value)}
          </span>
        ))}
      </div>
    );
  }

  if (item.type === 'metric') {
    const metricValue = readNumber(item.value);
    const metricWidth = metricValue === null
      ? 0
      : Math.min(100, Math.max(0, metricValue <= 1 ? metricValue * 100 : metricValue <= 10 ? metricValue * 10 : metricValue));

    return (
      <div className="gtg-dynamic-metric-value">
        <strong className="gtg-dynamic-value">{formatPrimitive(item.value)}</strong>
        <div className="gtg-dynamic-metric-track" aria-hidden="true">
          <span style={{ width: `${metricWidth}%` }} />
        </div>
      </div>
    );
  }

  return <strong className="gtg-dynamic-value">{formatPrimitive(item.value)}</strong>;
};

export const AppGoToGymWidgetsSection: React.FC<AppGoToGymSectionProps> = ({
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

export const AppGoToGymSection: React.FC<AppGoToGymSectionProps> = ({
  data,
  loading,
  error,
  forbidden,
}) => {
  const segments = useMemo(() => buildSegments(data), [data]);
  const generatedAt = data?.wellbeing_experience_value_v1?.generated_at;
  const profile = data?.profile;
  const wellbeing = data?.wellbeing_experience_value_v1;
  const globalWellbeing = wellbeing?.global_wellbeing;
  const ifPayload = wellbeing?.if_variable_payload;
  const experiencePack = wellbeing?.experience_value_pack;
  const portfolioSummary = wellbeing?.portfolio_summary;
  const devices = data?.devices;
  const happiness = getRecordValue(globalWellbeing, ['happiness_index', 'wellbeing_index', 'score']);
  const avg7d = getRecordValue(globalWellbeing, ['avg_7d', 'weekly_avg', 'average_7d']);
  const delta7d = getRecordValue(globalWellbeing, ['delta_7d', 'weekly_delta', 'change_7d']);
  const answeredQuestions = getCountFromValue(ifPayload, ['answered_questions', 'responses', 'answers', 'questions']);
  const trackedExperiences = getCountFromValue(portfolioSummary, ['experiences_tracked', 'accepted_experiences', 'experiences']);
  const connectedProviders = getCountFromValue(devices, ['connected_providers', 'providers', 'fitness']);
  const topScores = getArrayValue(ifPayload, ['top_scores', 'strengths', 'best_scores']);
  const lowScores = getArrayValue(ifPayload, ['low_scores', 'priorities', 'lowest_scores']);
  const experienceSummary = getRecordValue(experiencePack, ['analysis_summary', 'summary', 'recommendation']);
  const userName = getRecordValue(profile, ['full_name', 'username', 'email']);
  const contract = wellbeing?.contract ?? 'wellbeing_experience_value_v1';
  const commandMetrics = [
    {
      label: 'Bienestar actual',
      value: formatPercentLike(happiness),
      detail: avg7d ? `Promedio 7 dias: ${formatPercentLike(avg7d)}` : 'Indice personal',
      tone: getScoreTone(happiness),
    },
    {
      label: 'Cambio semanal',
      value: delta7d !== undefined ? formatPrimitive(delta7d) : '--',
      detail: 'Comparativo reciente',
      tone: getScoreTone(avg7d ?? happiness),
    },
    {
      label: 'Variables IF',
      value: answeredQuestions !== null ? String(Math.round(answeredQuestions)) : '--',
      detail: 'Respuestas disponibles',
      tone: 'is-high',
    },
    {
      label: 'Experiencias',
      value: trackedExperiences !== null ? String(Math.round(trackedExperiences)) : '--',
      detail: `${connectedProviders !== null ? Math.round(connectedProviders) : '--'} fuentes conectadas`,
      tone: 'is-mid',
    },
  ];

  return (
    <section className="gtg-app-gym-section gtg-app-gym-dynamic">
      <div className="gtg-user-wellbeing-hero">
        <div>
          <span className="gtg-user-wellbeing-kicker">Bienestar usuario</span>
          <h1>Panel personal GoToGym</h1>
          <p>
            Lectura dinamica del bienestar, variables IF, dispositivos y experiencias
            activas para que el usuario entienda su estado sin exponer datos innecesarios.
          </p>
          <div className="gtg-user-wellbeing-controls">
            <span>{generatedAt ? `Actualizado ${formatPrimitive(generatedAt)}` : 'Actualizacion en tiempo real'}</span>
            <strong>{typeof userName === 'string' ? userName : 'Usuario GoToGym'}</strong>
          </div>
        </div>

        <aside className="gtg-user-command-card">
          <span>Contrato</span>
          <strong>{contract}</strong>
          <p>Vista orientada a accion personal, progreso saludable y claridad de datos.</p>
          <small>Politica</small>
          <b>Datos personales protegidos</b>
        </aside>
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
        <>
          <div className="gtg-user-command-metrics">
            {commandMetrics.map(metric => (
              <article className={`gtg-user-command-metric ${metric.tone}`} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>

          <div className="gtg-user-insight-layout">
            <article className="gtg-user-insight-panel">
              <div className="gtg-business-panel-head">
                <span>Fortalezas detectadas</span>
                <strong>{topScores.length || '--'}</strong>
              </div>
              <ul className="gtg-user-signal-list">
                {(topScores.length ? topScores : ['Sin fortalezas suficientes aun.']).slice(0, 4).map((item, index) => (
                  <li key={`top-${index}`}>
                    {isRecord(item) ? summarizeObject(item) : formatPrimitive(item)}
                  </li>
                ))}
              </ul>
            </article>

            <article className="gtg-user-insight-panel">
              <div className="gtg-business-panel-head">
                <span>Prioridades de mejora</span>
                <strong>{lowScores.length || '--'}</strong>
              </div>
              <ul className="gtg-user-signal-list is-priority">
                {(lowScores.length ? lowScores : ['Sin prioridades criticas registradas.']).slice(0, 4).map((item, index) => (
                  <li key={`low-${index}`}>
                    {isRecord(item) ? summarizeObject(item) : formatPrimitive(item)}
                  </li>
                ))}
              </ul>
            </article>

            <article className="gtg-user-insight-panel">
              <div className="gtg-business-panel-head">
                <span>Inteligencia de experiencia</span>
                <strong>AI</strong>
              </div>
              <p>{typeof experienceSummary === 'string' ? experienceSummary : 'El endpoint esta listo para proyectar recomendaciones personalizadas cuando exista historial suficiente.'}</p>
            </article>
          </div>

          <div className="gtg-dynamic-segments">
            {segments.map(segment => (
              <article className={`gtg-dynamic-segment is-${segment.id}`} key={segment.id}>
                <div className="gtg-dynamic-segment-head">
                  <div>
                    <small>Bloque dinamico</small>
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
                      {item.description ? <p className="gtg-dynamic-help">{item.description}</p> : null}
                      {renderValue(item)}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
