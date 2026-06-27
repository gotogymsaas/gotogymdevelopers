import type { DeveloperApplication } from '../models/application.model';
import { readStore, updateStore } from '../storage/persistent-store';

export class ApplicationRepository {
  async findByOrganization(organizationId: string): Promise<DeveloperApplication[]> {
    return readStore().applications.filter(application => application.ownerOrganizationId === organizationId);
  }

  async findById(id: string): Promise<DeveloperApplication | undefined> {
    return readStore().applications.find(application => application.id === id);
  }

  async findByClientId(clientId: string): Promise<DeveloperApplication | undefined> {
    return readStore().applications.find(application => application.clientId === clientId);
  }

  async create(application: DeveloperApplication): Promise<DeveloperApplication> {
    updateStore(state => {
      state.applications.unshift(application);
    });
    return application;
  }

  async update(id: string, changes: Partial<DeveloperApplication>): Promise<DeveloperApplication | undefined> {
    let updated: DeveloperApplication | undefined;
    updateStore(state => {
      const application = state.applications.find(current => current.id === id);
      if (!application) {
        return;
      }

      Object.assign(application, changes);
      updated = application;
    });

    return updated;
  }
}
