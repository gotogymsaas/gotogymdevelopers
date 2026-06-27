import { requireOAuthAccessToken } from '../../api/middlewares/oauth.middleware';
import type { DeveloperScope } from '../../types/developer-scopes';

export const requireGatewayJwt = (...scopes: DeveloperScope[]) =>
  requireOAuthAccessToken(...scopes);
