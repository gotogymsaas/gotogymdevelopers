import { consentHistory, consents } from '../data/mock-consents';
import type { ConsentHistoryEvent, IntegrationConsent } from '../models/consent.model';

export class ConsentRepository {
  async findByUser(userId: string): Promise<IntegrationConsent[]> {
    return consents.filter(consent => consent.userId === userId);
  }

  async findById(id: string): Promise<IntegrationConsent | undefined> {
    return consents.find(consent => consent.id === id);
  }

  async update(id: string, changes: Partial<IntegrationConsent>): Promise<IntegrationConsent | undefined> {
    const consent = await this.findById(id);
    if (!consent) {
      return undefined;
    }

    Object.assign(consent, changes);
    return consent;
  }

  async findHistory(consentId: string): Promise<ConsentHistoryEvent[]> {
    return consentHistory.filter(event => event.consentId === consentId);
  }

  async addHistory(event: ConsentHistoryEvent): Promise<ConsentHistoryEvent> {
    consentHistory.unshift(event);
    return event;
  }
}
