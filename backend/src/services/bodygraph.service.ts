import { BodyGraphPayload } from '../models/bodygraph.model';

export async function getBodyGraphPayload(integrationId: string): Promise<BodyGraphPayload> {
  // Simulación de métricas normalizadas
  return {
    integrationId,
    metrics: [
      {
        type: 'heart_rate',
        value: 80,
        unit: 'bpm',
        source: 'HealthKit',
        timestamp: new Date().toISOString()
      },
      {
        type: 'steps',
        value: 1200,
        unit: 'count',
        source: 'HealthKit',
        timestamp: new Date().toISOString()
      }
    ],
    generatedAt: new Date().toISOString()
  };
}
