import {
  DEVELOPER_SCOPE_DEFINITIONS,
  type DeveloperScope,
  isDeveloperScope,
} from '../../types/developer-scopes';
import type { ConsentDecision } from '../types/coach-integration.types';
import { ConsentRepository } from '../../repositories/consent.repository';

const consentRepo = new ConsentRepository();

export function parseGrantedScopes(scope?: string): DeveloperScope[] {
  if (!scope) {
    return [];
  }

  return scope.split(' ').filter(isDeveloperScope);
}

export function evaluateConsentPolicy(
  requestedScopes: DeveloperScope[],
  grantedScopes: DeveloperScope[],
  consentedScopes: DeveloperScope[] = grantedScopes,
): ConsentDecision {
  const scopesRequiringConsent = requestedScopes.filter(
    scope => DEVELOPER_SCOPE_DEFINITIONS[scope].requiresConsent,
  );
  const missingScopes = scopesRequiringConsent.filter(scope =>
    !grantedScopes.includes(scope) || !consentedScopes.includes(scope)
  );

  return {
    allowed: missingScopes.length === 0,
    enforced: scopesRequiringConsent.length > 0,
    requiredScopes: scopesRequiringConsent,
    missingScopes,
    reason: missingScopes.length > 0 ? 'Missing user consent for requested scopes' : undefined,
  };
}

export async function getConsentedScopesForClient(
  userId: string,
  clientId: string,
): Promise<DeveloperScope[]> {
  const consent = await consentRepo.findAuthorizedForClient(userId, clientId);
  return consent?.requestedScopes ?? [];
}
