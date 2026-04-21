import { SmartwatchMetric } from '../models/smartwatch.model';
import { SmartwatchRepository } from '../repositories/smartwatch.repository';

const smartwatchRepository = new SmartwatchRepository();

export async function listSmartwatchMetrics(userId: string): Promise<SmartwatchMetric[]> {
  return smartwatchRepository.findAllByUser(userId);
}
