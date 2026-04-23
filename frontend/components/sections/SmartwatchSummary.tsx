import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ActivitySummaryDatum, HeartRateTrendPoint, SleepPhaseDatum } from '../../types/types';
import { ActivityChart } from './ActivityChart';
import { HeartRateChart } from './HeartRateChart';
import { SleepChart } from './SleepChart';

type SummaryCardTarget = 'heart_rate' | 'sleep' | 'physical_activity';

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
  const navigate = useNavigate();

  const averageHeartRate =
    heartRateTrend.length > 0
      ? Math.round(heartRateTrend.reduce((sum, point) => sum + point.bpm, 0) / heartRateTrend.length)
      : 0;

  const totalSleepHours = sleepPhases.reduce((sum, phase) => sum + phase.hours, 0);
  const steps = activitySummary.find(metric => metric.metric === 'Pasos')?.value ?? 0;

  const handleChartNavigate = (activeCard: SummaryCardTarget) => {
    navigate('/cards', { state: { activeCard } });
  };

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
          <button
            type="button"
            className="gtg-chart-click-area"
            onClick={() => handleChartNavigate('heart_rate')}
            aria-label="Abrir card de ritmo cardiaco"
          >
            <HeartRateChart data={heartRateTrend} />
          </button>
        </article>

        <article className="gtg-chart-card">
          <header className="gtg-chart-card-header">
            <h3>Calidad de sueno</h3>
            <span>{totalSleepHours.toFixed(1)} h totales</span>
          </header>
          <button
            type="button"
            className="gtg-chart-click-area"
            onClick={() => handleChartNavigate('sleep')}
            aria-label="Abrir card de sueno"
          >
            <SleepChart data={sleepPhases} />
          </button>
        </article>

        <article className="gtg-chart-card">
          <header className="gtg-chart-card-header">
            <h3>Actividad diaria</h3>
            <span>{steps.toLocaleString('es-ES')} pasos</span>
          </header>
          <button
            type="button"
            className="gtg-chart-click-area"
            onClick={() => handleChartNavigate('physical_activity')}
            aria-label="Abrir card de actividad fisica"
          >
            <ActivityChart data={activitySummary} />
          </button>
        </article>
      </div>
    </section>
  );
};
