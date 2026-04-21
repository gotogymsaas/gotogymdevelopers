import type { SmartwatchMetric, SmartwatchMetricDetailsMap } from '../types/types';

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

export const smartwatchMetricDetailsMock: SmartwatchMetricDetailsMap = {
  heart_rate: {
    sections: [
      {
        title: 'Lecturas de frecuencia',
        items: [
          { label: 'Reposo', value: '75 bpm', tone: 'good' },
          { label: 'Actividad', value: '142 bpm', tone: 'info' },
        ],
      },
      {
        title: 'Alertas de seguridad',
        items: [
          { label: 'Muy alta (>170 bpm)', value: 'Sin alertas', tone: 'good' },
          { label: 'Muy baja (<45 bpm)', value: 'Sin alertas', tone: 'good' },
        ],
        note: 'Deteccion de irregularidades: sin eventos sospechosos (informativo).',
      },
    ],
  },
  spo2: {
    sections: [
      {
        title: 'Saturacion de oxigeno',
        items: [
          { label: 'Nivel actual', value: '98%', tone: 'good' },
          { label: 'Estado', value: 'Normal', tone: 'good' },
        ],
      },
    ],
  },
  sleep: {
    sections: [
      {
        title: 'Resumen de descanso',
        items: [
          { label: 'Horas dormidas', value: '7h 30m', tone: 'good' },
          { label: 'Calidad del sueno', value: 'Buena', tone: 'good' },
        ],
      },
      {
        title: 'Fases del sueno',
        items: [
          { label: 'Ligero', value: '4h 05m', tone: 'normal' },
          { label: 'Profundo', value: '1h 45m', tone: 'good' },
          { label: 'REM', value: '1h 40m', tone: 'info' },
        ],
      },
    ],
  },
  physical_activity: {
    sections: [
      {
        title: 'Actividad diaria',
        items: [
          { label: 'Pasos', value: '8,450', tone: 'good' },
          { label: 'Distancia', value: '6.8 km', tone: 'info' },
          { label: 'Calorias', value: '510 kcal', tone: 'warning' },
          { label: 'Tipo de actividad', value: 'Caminata + funcional', tone: 'normal' },
        ],
      },
    ],
  },
  stress: {
    sections: [
      {
        title: 'Nivel de estres',
        items: [
          { label: 'Indice actual', value: '32 / 100', tone: 'warning' },
          { label: 'Base cardiaca', value: 'Variabilidad estable', tone: 'normal' },
          { label: 'Sugerencia', value: 'Respiracion guiada 3 min', tone: 'info' },
        ],
      },
    ],
  },
  blood_pressure: {
    sections: [
      {
        title: 'Presion arterial estimada',
        items: [
          { label: 'Sistolica / Diastolica', value: '118 / 76 mmHg', tone: 'good' },
          { label: 'Estado estimado', value: 'Dentro de rango', tone: 'good' },
        ],
        note: 'Nota: estimacion orientativa, precision limitada frente a equipos clinicos.',
      },
    ],
  },
  ecg: {
    sections: [
      {
        title: 'Estado ECG',
        items: [
          { label: 'Resultado general', value: 'Sin anomalias', tone: 'good' },
          { label: 'Patrones FA', value: 'No detectados', tone: 'good' },
        ],
        note: 'Deteccion de patrones cardiacos con caracter informativo.',
      },
    ],
  },
  body_temperature: {
    sections: [
      {
        title: 'Temperatura corporal',
        items: [
          { label: 'Valor actual', value: '36.6 C', tone: 'good' },
          { label: 'Variacion 24h', value: '+0.3 C', tone: 'normal' },
        ],
      },
    ],
  },
  health_tracking: {
    sections: [
      {
        title: 'Seguimiento general',
        items: [
          { label: 'Movimiento', value: '2 recordatorios enviados', tone: 'info' },
          { label: 'Hidratacion', value: '1.8 L / objetivo 2.2 L', tone: 'warning' },
          { label: 'Estado global', value: '92 / 100', tone: 'good' },
        ],
      },
    ],
  },
};