import type { OAuthAuthorizationCode, OAuthRefreshToken, OAuthSigningKey } from '../models/oauth.model';

const authorizationCodes: OAuthAuthorizationCode[] = [];
const refreshTokens: OAuthRefreshToken[] = [];
const revokedAccessTokenIds = new Set<string>();
const signingKeys: OAuthSigningKey[] = [];

export class OAuthRepository {
  async saveAuthorizationCode(code: OAuthAuthorizationCode): Promise<OAuthAuthorizationCode> {
    authorizationCodes.unshift(code);
    return code;
  }

  async findAuthorizationCode(code: string): Promise<OAuthAuthorizationCode | undefined> {
    return authorizationCodes.find(current => current.code === code);
  }

  async consumeAuthorizationCode(code: string): Promise<void> {
    const authorizationCode = await this.findAuthorizationCode(code);
    if (authorizationCode) {
      authorizationCode.consumedAt = new Date().toISOString();
    }
  }

  async saveRefreshToken(token: OAuthRefreshToken): Promise<OAuthRefreshToken> {
    refreshTokens.unshift(token);
    return token;
  }

  async findRefreshToken(tokenHash: string): Promise<OAuthRefreshToken | undefined> {
    return refreshTokens.find(current => current.tokenHash === tokenHash);
  }

  async revokeRefreshToken(tokenHash: string, replacedByHash?: string): Promise<void> {
    const token = await this.findRefreshToken(tokenHash);
    if (token) {
      token.revokedAt = new Date().toISOString();
      token.replacedByHash = replacedByHash;
    }
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    const now = new Date().toISOString();
    refreshTokens
      .filter(token => token.familyId === familyId && !token.revokedAt)
      .forEach(token => {
        token.revokedAt = now;
      });
  }

  async revokeAccessTokenId(jti: string): Promise<void> {
    revokedAccessTokenIds.add(jti);
  }

  async isAccessTokenRevoked(jti: string): Promise<boolean> {
    return revokedAccessTokenIds.has(jti);
  }

  async saveSigningKey(key: OAuthSigningKey): Promise<OAuthSigningKey> {
    signingKeys.unshift(key);
    return key;
  }

  async listSigningKeys(): Promise<OAuthSigningKey[]> {
    return [...signingKeys];
  }

  async getActiveSigningKey(): Promise<OAuthSigningKey | undefined> {
    return signingKeys.find(key => key.status === 'active');
  }

  async findSigningKey(kid: string): Promise<OAuthSigningKey | undefined> {
    return signingKeys.find(key => key.kid === kid);
  }

  async retireActiveKeys(): Promise<void> {
    const now = new Date().toISOString();
    signingKeys
      .filter(key => key.status === 'active')
      .forEach(key => {
        key.status = 'retiring';
        key.retiredAt = now;
      });
  }
}
