import { SmartwatchMetric } from '../models/smartwatch.model';

const userMetrics: SmartwatchMetric[] = [
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

const gymMetrics: SmartwatchMetric[] = [
  {
    id: 'heart_rate',
    title: 'Ritmo cardiaco',
    value: '81 bpm',
    note: 'Promedio durante entrenamiento',
  },
  {
    id: 'spo2',
    title: 'Oxigeno en sangre (SpO2)',
    value: '97%',
    note: 'Sin variaciones relevantes',
  },
  {
    id: 'sleep',
    title: 'Sueno',
    value: '6h 40m',
    note: 'Recuperacion media',
  },
  {
    id: 'physical_activity',
    title: 'Actividad fisica',
    value: '12,200 pasos',
    note: 'Alta carga de actividad',
  },
  {
    id: 'stress',
    title: 'Estres',
    value: '41 / 100',
    note: 'Nivel moderado-alto',
  },
  {
    id: 'blood_pressure',
    title: 'Presion arterial',
    value: '122/78 mmHg',
    note: 'Dentro del rango esperado',
  },
  {
    id: 'ecg',
    title: 'ECG',
    value: 'Sin anomalias',
    note: 'Ultimo registro estable',
  },
  {
    id: 'body_temperature',
    title: 'Temperatura corporal',
    value: '36.8 C',
    note: 'Ligero incremento post actividad',
  },
  {
    id: 'health_tracking',
    title: 'Seguimiento de salud general',
    value: '88 / 100',
    note: 'Estado general: activo',
  },
];

const adminMetrics: SmartwatchMetric[] = [
  {
    id: 'heart_rate',
    title: 'Ritmo cardiaco',
    value: '73 bpm',
    note: 'Lectura estable en reposo',
  },
  {
    id: 'spo2',
    title: 'Oxigeno en sangre (SpO2)',
    value: '99%',
    note: 'Saturacion alta',
  },
  {
    id: 'sleep',
    title: 'Sueno',
    value: '7h 05m',
    note: 'Sueno reparador',
  },
  {
    id: 'physical_activity',
    title: 'Actividad fisica',
    value: '6,300 pasos',
    note: 'Actividad ligera',
  },
  {
    id: 'stress',
    title: 'Estres',
    value: '28 / 100',
    note: 'Nivel bajo',
  },
  {
    id: 'blood_pressure',
    title: 'Presion arterial',
    value: '116/74 mmHg',
    note: 'Normal',
  },
  {
    id: 'ecg',
    title: 'ECG',
    value: 'Sin anomalias',
    note: 'Sin cambios en el trazado',
  },
  {
    id: 'body_temperature',
    title: 'Temperatura corporal',
    value: '36.5 C',
    note: 'Temperatura basal estable',
  },
  {
    id: 'health_tracking',
    title: 'Seguimiento de salud general',
    value: '94 / 100',
    note: 'Estado general: excelente',
  },
];

export const smartwatchMetricsByUserId: Record<string, SmartwatchMetric[]> = {
  'user-001': userMetrics,
  'gym-001': gymMetrics,
  'admin-001': adminMetrics,
};

export const defaultSmartwatchMetrics = userMetrics;
