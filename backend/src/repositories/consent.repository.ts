import type { ConsentHistoryEvent, IntegrationConsent } from '../models/consent.model';
import { readStore, updateStore } from '../storage/persistent-store';

export class ConsentRepository {
  async findByUser(userId: string): Promise<IntegrationConsent[]> {
    return readStore().consents.filter(consent => consent.userId === userId);
  }

  async findById(id: string): Promise<IntegrationConsent | undefined> {
    return readStore().consents.find(consent => consent.id === id);
  }

  async findAuthorizedForClient(userId: string, clientId: string): Promise<IntegrationConsent | undefined> {
    return readStore().consents.find(consent =>
      consent.userId === userId
      && consent.clientId === clientId
      && consent.status === 'authorized'
    );
  }

  async findByUserAndClient(userId: string, clientId: string): Promise<IntegrationConsent | undefined> {
    return readStore().consents.find(consent =>
      consent.userId === userId
      && consent.clientId === clientId
    );
  }

  async create(consent: IntegrationConsent): Promise<IntegrationConsent> {
    updateStore(state => {
      state.consents.unshift(consent);
    });
    return consent;
  }

  async update(id: string, changes: Partial<IntegrationConsent>): Promise<IntegrationConsent | undefined> {
    let updated: IntegrationConsent | undefined;
    updateStore(state => {
      const consent = state.consents.find(current => current.id === id);
      if (!consent) {
        return;
      }

      Object.assign(consent, changes);
      updated = consent;
    });

    return updated;
  }

  async findHistory(consentId: string): Promise<ConsentHistoryEvent[]> {
    return readStore().consentHistory.filter(event => event.consentId === consentId);
  }

  async addHistory(event: ConsentHistoryEvent): Promise<ConsentHistoryEvent> {
    updateStore(state => {
      state.consentHistory.unshift(event);
    });
    return event;
  }
}
