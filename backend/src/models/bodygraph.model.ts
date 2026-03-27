export interface BodyGraphMetric {
  type: string; // e.g. 'heart_rate'
  value: number;
  unit: string; // e.g. 'bpm'
  source: string;
  timestamp: string; // ISO date
}

export interface BodyGraphPayload {
  integrationId: string;
  metrics: BodyGraphMetric[];
  generatedAt: string; // ISO date
}
