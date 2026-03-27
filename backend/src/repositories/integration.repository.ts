import { Integration } from '../models/integration.model';
import { integrations } from '../data/mock-integrations';

export class IntegrationRepository {
  async findAll(): Promise<Integration[]> {
    // Aquí irá la lógica de base de datos en el futuro
    return integrations;
  }
  async findById(id: string): Promise<Integration | undefined> {
    return integrations.find(i => i.id === id);
  }
  // Métodos para crear, actualizar, eliminar, etc.
}
