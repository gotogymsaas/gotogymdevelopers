import React from 'react';
import type { ActivitySummaryDatum, HeartRateTrendPoint, SleepPhaseDatum } from '../../types/types';
import { ActivityChart } from './ActivityChart';
import { HeartRateChart } from './HeartRateChart';
import { SleepChart } from './SleepChart';

interface SmartwatchSummaryProps {
  heartRateTrend: HeartRateTrendPoint[];
  sleepPhases: SleepPhaseDatum[];
  activitySummary: ActivitySummaryDatum[];
}

export const SmartwatchSummary: React.FC<SmartwatchSummaryProps> = ({
  heartRateTrend,
  sleepPhases,
  activitySummary,
}) => {
  const averageHeartRate =
    heartRateTrend.length > 0
      ? Math.round(heartRateTrend.reduce((sum, point) => sum + point.bpm, 0) / heartRateTrend.length)
      : 0;

  const totalSleepHours = sleepPhases.reduce((sum, phase) => sum + phase.hours, 0);
  const steps = activitySummary.find(metric => metric.metric === 'Pasos')?.value ?? 0;

  return (
    <section className="gtg-smartwatch-summary" aria-label="Resumen Smartwatch">
      <div className="gtg-smartwatch-summary-header">
        <h2>Resumen Smartwatch</h2>
        <p>Vista rapida de frecuencia cardiaca, sueno y actividad diaria.</p>
      </div>

      <div className="gtg-smartwatch-summary-grid">
        <article className="gtg-chart-card">
          <header className="gtg-chart-card-header">
            <h3>Frecuencia cardiaca</h3>
            <span>{averageHeartRate} bpm promedio</span>
          </header>
          <HeartRateChart data={heartRateTrend} />
        </article>

        <article className="gtg-chart-card">
          <header className="gtg-chart-card-header">
            <h3>Calidad de sueno</h3>
            <span>{totalSleepHours.toFixed(1)} h totales</span>
          </header>
          <SleepChart data={sleepPhases} />
        </article>

        <article className="gtg-chart-card">
          <header className="gtg-chart-card-header">
            <h3>Actividad diaria</h3>
            <span>{steps.toLocaleString('es-ES')} pasos</span>
          </header>
          <ActivityChart data={activitySummary} />
        </article>
      </div>
    </section>
  );
};
