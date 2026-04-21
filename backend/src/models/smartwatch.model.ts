export type SmartwatchMetricId =
  | 'heart_rate'
  | 'spo2'
  | 'sleep'
  | 'physical_activity'
  | 'stress'
  | 'blood_pressure'
  | 'ecg'
  | 'body_temperature'
  | 'health_tracking';

export interface SmartwatchMetric {
  id: SmartwatchMetricId;
  title: string;
  value: string;
  note: string;
}
