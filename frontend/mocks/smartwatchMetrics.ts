import type { SmartwatchMetric } from '../types/types';

export const smartwatchMetricsMock: SmartwatchMetric[] = [
  {
    id: 'heart_rate',
    title: 'Ritmo cardiaco',
    value: '75 bpm',
    note: 'Rango normal en reposo',
  },
  {
    id: 'spo2',
    title: 'Oxigeno en sangre (SpO2)',
    value: '98%',
    note: 'Saturacion optima',
  },
  {
    id: 'sleep',
    title: 'Sueno',
    value: '7h 30m',
    note: 'Calidad de descanso: buena',
  },
  {
    id: 'physical_activity',
    title: 'Actividad fisica',
    value: '8,450 pasos',
    note: '62 min de actividad moderada',
  },
  {
    id: 'stress',
    title: 'Estres',
    value: '32 / 100',
    note: 'Nivel actual: moderado',
  },
  {
    id: 'blood_pressure',
    title: 'Presion arterial',
    value: '118/76 mmHg',
    note: 'Sin alertas en las ultimas 24h',
  },
  {
    id: 'ecg',
    title: 'ECG',
    value: 'Sin anomalias',
    note: 'Ultima lectura completada',
  },
  {
    id: 'body_temperature',
    title: 'Temperatura corporal',
    value: '36.6 C',
    note: 'Variacion estable durante el dia',
  },
  {
    id: 'health_tracking',
    title: 'Seguimiento de salud general',
    value: '92 / 100',
    note: 'Estado general: saludable',
  },
];