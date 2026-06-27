import type { DeveloperScope } from '../../types/developer-scopes';
import type { CoachUserContext, SensitiveField } from '../types/coach-integration.types';

export function enforceSensitiveDataPolicy(
  context: CoachUserContext,
  grantedScopes: DeveloperScope[],
): CoachUserContext {
  const redactions = new Set<SensitiveField>(context.redactions);
  const safeContext: CoachUserContext = {
    ...context,
    redactions: context.redactions,
  };

  if (!grantedScopes.includes('profile.read')) {
    delete safeContext.profile;
    redactions.add('profile.email');
    redactions.add('profile.name');
  }

  if (!grantedScopes.includes('wellbeing.read')) {
    delete safeContext.wellbeing;
    redactions.add('wellbeing.freeText');
  }

  if (!grantedScopes.includes('metrics.read')) {
    delete safeContext.metrics;
    redactions.add('metrics.rawSamples');
  }

  if (!grantedScopes.includes('devices.read')) {
    delete safeContext.devices;
  }

  if (!grantedScopes.includes('documents.read')) {
    delete safeContext.documents;
    redactions.add('documents.rawText');
  }

  safeContext.redactions = [...redactions];
  return safeContext;
}
