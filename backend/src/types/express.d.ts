import { AuthUser } from './auth';
import type { OAuthIntrospectionResponse } from '../models/oauth.model';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      oauthToken?: OAuthIntrospectionResponse;
    }
  }
}

export {};
