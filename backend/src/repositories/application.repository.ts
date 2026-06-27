import { applications } from '../data/mock-applications';
import type { DeveloperApplication } from '../models/application.model';

export class ApplicationRepository {
  async findByOrganization(organizationId: string): Promise<DeveloperApplication[]> {
    return applications.filter(application => application.ownerOrganizationId === organizationId);
  }

  async findById(id: string): Promise<DeveloperApplication | undefined> {
    return applications.find(application => application.id === id);
  }

  async findByClientId(clientId: string): Promise<DeveloperApplication | undefined> {
    return applications.find(application => application.clientId === clientId);
  }

  async create(application: DeveloperApplication): Promise<DeveloperApplication> {
    applications.unshift(application);
    return application;
  }

  async update(id: string, changes: Partial<DeveloperApplication>): Promise<DeveloperApplication | undefined> {
    const application = await this.findById(id);
    if (!application) {
      return undefined;
    }

    Object.assign(application, changes);
    return application;
  }
}
