import type { OAuthAuthorizationCode, OAuthRefreshToken, OAuthSigningKey } from '../models/oauth.model';
import { readStore, updateStore } from '../storage/persistent-store';

export class OAuthRepository {
  async saveAuthorizationCode(code: OAuthAuthorizationCode): Promise<OAuthAuthorizationCode> {
    updateStore(state => {
      state.oauth.authorizationCodes.unshift(code);
    });
    return code;
  }

  async findAuthorizationCode(code: string): Promise<OAuthAuthorizationCode | undefined> {
    return readStore().oauth.authorizationCodes.find(current => current.code === code);
  }

  async consumeAuthorizationCode(code: string): Promise<void> {
    updateStore(state => {
      const authorizationCode = state.oauth.authorizationCodes.find(current => current.code === code);
      if (authorizationCode) {
        authorizationCode.consumedAt = new Date().toISOString();
      }
    });
  }

  async saveRefreshToken(token: OAuthRefreshToken): Promise<OAuthRefreshToken> {
    updateStore(state => {
      state.oauth.refreshTokens.unshift(token);
    });
    return token;
  }

  async findRefreshToken(tokenHash: string): Promise<OAuthRefreshToken | undefined> {
    return readStore().oauth.refreshTokens.find(current => current.tokenHash === tokenHash);
  }

  async revokeRefreshToken(tokenHash: string, replacedByHash?: string): Promise<void> {
    updateStore(state => {
      const token = state.oauth.refreshTokens.find(current => current.tokenHash === tokenHash);
      if (token) {
        token.revokedAt = new Date().toISOString();
        token.replacedByHash = replacedByHash;
      }
    });
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    const now = new Date().toISOString();
    updateStore(state => {
      state.oauth.refreshTokens
        .filter(token => token.familyId === familyId && !token.revokedAt)
        .forEach(token => {
          token.revokedAt = now;
        });
    });
  }

  async revokeAccessTokenId(jti: string): Promise<void> {
    updateStore(state => {
      if (!state.oauth.revokedAccessTokenIds.includes(jti)) {
        state.oauth.revokedAccessTokenIds.push(jti);
      }
    });
  }

  async isAccessTokenRevoked(jti: string): Promise<boolean> {
    return readStore().oauth.revokedAccessTokenIds.includes(jti);
  }

  async saveSigningKey(key: OAuthSigningKey): Promise<OAuthSigningKey> {
    updateStore(state => {
      state.oauth.signingKeys.unshift(key);
    });
    return key;
  }

  async listSigningKeys(): Promise<OAuthSigningKey[]> {
    return [...readStore().oauth.signingKeys];
  }

  async getActiveSigningKey(): Promise<OAuthSigningKey | undefined> {
    return readStore().oauth.signingKeys.find(key => key.status === 'active');
  }

  async findSigningKey(kid: string): Promise<OAuthSigningKey | undefined> {
    return readStore().oauth.signingKeys.find(key => key.kid === kid);
  }

  async retireActiveKeys(): Promise<void> {
    const now = new Date().toISOString();
    updateStore(state => {
      state.oauth.signingKeys
        .filter(key => key.status === 'active')
        .forEach(key => {
          key.status = 'retiring';
          key.retiredAt = now;
        });
    });
  }
}
