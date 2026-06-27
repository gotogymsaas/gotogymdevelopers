import {
  DEVELOPER_SCOPE_DEFINITIONS,
  type DeveloperScope,
  isDeveloperScope,
} from '../../types/developer-scopes';
import type { ConsentDecision } from '../types/coach-integration.types';

export function parseGrantedScopes(scope?: string): DeveloperScope[] {
  if (!scope) {
    return [];
  }

  return scope.split(' ').filter(isDeveloperScope);
}

export function evaluateConsentPolicy(
  requestedScopes: DeveloperScope[],
  grantedScopes: DeveloperScope[],
): ConsentDecision {
  const scopesRequiringConsent = requestedScopes.filter(
    scope => DEVELOPER_SCOPE_DEFINITIONS[scope].requiresConsent,
  );
  const missingScopes = scopesRequiringConsent.filter(scope => !grantedScopes.includes(scope));

  return {
    allowed: missingScopes.length === 0,
    enforced: scopesRequiringConsent.length > 0,
    requiredScopes: scopesRequiringConsent,
    missingScopes,
    reason: missingScopes.length > 0 ? 'Missing user consent for requested scopes' : undefined,
  };
}
