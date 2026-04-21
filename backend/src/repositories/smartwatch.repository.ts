import {
  defaultSmartwatchMetrics,
  smartwatchMetricsByUserId,
} from '../data/mock-smartwatch-metrics';
import { SmartwatchMetric } from '../models/smartwatch.model';

export class SmartwatchRepository {
  async findAllByUser(userId: string): Promise<SmartwatchMetric[]> {
    // Futuro: resolver por userId desde base de datos real.
    return smartwatchMetricsByUserId[userId] ?? defaultSmartwatchMetrics;
  }
}
