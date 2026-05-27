import React, { useMemo } from 'react';
import type { CoachContextResponse } from '../../src/services/wellbeingService';

interface AppGoToGymCardsSectionProps {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
}

export const appGoToGymQuestions = [
  { id: 's_steps', label: 'Nivel de actividad fisica (Pasos)' },
  { id: 's_sleep', label: 'Horas de sueno promedio' },
  { id: 's_stress_inv', label: 'Manejo del estres (10 = Excelente, 1 = Pesimo)' },
  { id: 's_intensity', label: 'Intensidad de entrenamientos' },
  { id: 's_emotional', label: 'Estabilidad emocional' },
  { id: 's_social', label: 'Vida social y conexiones' },
  { id: 's_hrv', label: 'Variabilidad cardiaca (Sensacion de recuperacion)' },
  { id: 's_bio_age', label: 'Edad Biologica (Percepcion de vitalidad)' },
  { id: 's_sleep_quality', label: 'Calidad del sueno' },
  { id: 's_circadian', label: 'Sincronizacion ritmo circadiano (Rutina)' },
] as const;

type AppGoToGymQuestionId = typeof appGoToGymQuestions[number]['id'];
type ScoreMap = Partial<Record<AppGoToGymQuestionId, number>>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeScore = (value: unknown): number | null => {
  const raw = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;

  if (!Number.isFinite(raw)) {
    return null;
  }

  return Math.min(10, Math.max(0, raw));
};

const mergeScoresFromRecord = (target: ScoreMap, source: unknown) => {
  if (!isRecord(source)) {
    return;
  }

  appGoToGymQuestions.forEach(question => {
    const score = normalizeScore(source[question.id]);
    if (score !== null) {
      target[question.id] = score;
    }
  });
};

const mergeScoresFromArray = (target: ScoreMap, source: unknown) => {
  if (!Array.isArray(source)) {
    return;
  }

  source.forEach(item => {
    if (!isRecord(item)) {
      return;
    }

    const questionId = item.question_id;
    if (typeof questionId !== 'string') {
      return;
    }

    const knownQuestion = appGoToGymQuestions.find(question => question.id === questionId);
    if (!knownQuestion) {
      return;
    }

    const score = normalizeScore(item.score ?? item.value ?? item.answer);
    if (score !== null) {
      target[knownQuestion.id] = score;
    }
  });
};

export const extractAppGoToGymScores = (data: CoachContextResponse | null): ScoreMap => {
  const scores: ScoreMap = {};
  const ifSnapshot = data?.if_snapshot;
  const wellbeingPayload = data?.wellbeing_experience_value_v1?.if_variable_payload;
  const latestRecord = isRecord(ifSnapshot) ? ifSnapshot.latest_record : undefined;

  if (isRecord(ifSnapshot)) {
    mergeScoresFromRecord(scores, ifSnapshot.scores);
    mergeScoresFromArray(scores, ifSnapshot.scores);
    mergeScoresFromArray(scores, ifSnapshot.answers);
  }

  if (isRecord(latestRecord)) {
    mergeScoresFromRecord(scores, latestRecord.scores);
    mergeScoresFromArray(scores, latestRecord.scores);
    mergeScoresFromArray(scores, latestRecord.answers);
  }

  if (isRecord(wellbeingPayload)) {
    mergeScoresFromRecord(scores, wellbeingPayload.scores);
    mergeScoresFromArray(scores, wellbeingPayload.scores);
    mergeScoresFromArray(scores, wellbeingPayload.answers);
    mergeScoresFromArray(scores, wellbeingPayload.responses);
    mergeScoresFromArray(scores, wellbeingPayload.questions);
  }

  return scores;
};

const findTimestamp = (source: unknown): string | null => {
  if (!isRecord(source)) {
    return null;
  }

  const candidates = [
    source.updated_at,
    source.generated_at,
    source.created_at,
    source.timestamp,
    source.submitted_at,
  ];

  const found = candidates.find(candidate => typeof candidate === 'string' && candidate.trim());
  return typeof found === 'string' ? found : null;
};

export const extractAppGoToGymUpdatedAt = (data: CoachContextResponse | null): string | null => {
  const ifSnapshot = data?.if_snapshot;
  const wellbeing = data?.wellbeing_experience_value_v1;
  const wellbeingPayload = wellbeing?.if_variable_payload;
  const latestRecord = isRecord(ifSnapshot) ? ifSnapshot.latest_record : undefined;

  return (
    findTimestamp(latestRecord) ??
    findTimestamp(ifSnapshot) ??
    findTimestamp(wellbeingPayload) ??
    findTimestamp(wellbeing) ??
    null
  );
};

const formatUpdatedAt = (value: string | null): string => {
  if (!value) {
    return 'Actualizacion sin fecha';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Actualizado: ${value}`;
  }

  return `Actualizado: ${new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)}`;
};

export const AppGoToGymCardsSection: React.FC<AppGoToGymCardsSectionProps> = ({
  data,
  loading,
  error,
  forbidden,
}) => {
  const scores = useMemo(() => extractAppGoToGymScores(data), [data]);
  const updatedAt = useMemo(() => formatUpdatedAt(extractAppGoToGymUpdatedAt(data)), [data]);
  const hasScores = appGoToGymQuestions.some(question => scores[question.id] !== undefined);

  return (
    <section className="gtg-app-gym-section">
      <div className="gtg-section-header">
        <h2 className="gtg-section-title">APP GOTO GYM</h2>
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

      {!loading && !forbidden && !error && !hasScores && (
        <div className="gtg-app-gym-status">No hay scores disponibles en el endpoint.</div>
      )}

      {!loading && !forbidden && !error && (
        <div className="gtg-app-gym-grid">
          {appGoToGymQuestions.map(question => {
            const score = scores[question.id];
            const width = score === undefined ? 0 : score * 10;

            return (
              <article className={`gtg-app-gym-card${score === undefined ? ' is-empty' : ''}`} key={question.id}>
                <div className="gtg-app-gym-card-head">
                  <h3>{question.label}</h3>
                  <span className="gtg-app-gym-score">{score === undefined ? 'Sin dato' : `${Math.round(score * 10) / 10}/10`}</span>
                </div>
                <p className="gtg-app-gym-card-note">{updatedAt}</p>
                <div className="gtg-app-gym-track" aria-hidden="true">
                  <span className="gtg-app-gym-fill" style={{ width: `${width}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
