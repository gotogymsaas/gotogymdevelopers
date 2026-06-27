import { NextFunction, Request, Response } from 'express';
import * as OAuthService from '../services/oauth.service';
import type { ApiResponse } from '../types/api-response';

const requireActor = (req: Request) => {
  if (!req.authUser) {
    const error: any = new Error('Authentication is required');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  return req.authUser;
};

const readString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const requireString = (value: unknown, field: string): string => {
  const parsed = readString(value);
  if (!parsed) {
    const error: any = new Error(`${field} is required`);
    error.status = 400;
    error.code = 'BAD_REQUEST';
    throw error;
  }

  return parsed;
};

export function getOpenIdConfiguration(_req: Request, res: Response) {
  res.json(OAuthService.getOpenIdConfiguration());
}

export async function getJwks(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await OAuthService.getJwks());
  } catch (err) {
    next(err);
  }
}

export async function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await OAuthService.createAuthorizationCode({
      actor: requireActor(req),
      clientId: requireString(req.query.client_id, 'client_id'),
      redirectUri: requireString(req.query.redirect_uri, 'redirect_uri'),
      scope: requireString(req.query.scope, 'scope'),
      codeChallenge: requireString(req.query.code_challenge, 'code_challenge'),
      codeChallengeMethod: requireString(req.query.code_challenge_method, 'code_challenge_method') as 'S256',
      state: readString(req.query.state),
      nonce: readString(req.query.nonce),
    });
    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function token(req: Request, res: Response, next: NextFunction) {
  try {
    const grantType = requireString(req.body.grant_type, 'grant_type');
    const clientId = requireString(req.body.client_id, 'client_id');
    const data = grantType === 'authorization_code'
      ? await OAuthService.exchangeAuthorizationCode({
        code: requireString(req.body.code, 'code'),
        clientId,
        redirectUri: requireString(req.body.redirect_uri, 'redirect_uri'),
        codeVerifier: requireString(req.body.code_verifier, 'code_verifier'),
      })
      : grantType === 'refresh_token'
        ? await OAuthService.rotateRefreshToken({
          refreshToken: requireString(req.body.refresh_token, 'refresh_token'),
          clientId,
        })
        : (() => {
          const error: any = new Error('Unsupported grant_type');
          error.status = 400;
          error.code = 'UNSUPPORTED_GRANT_TYPE';
          throw error;
        })();

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function introspect(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await OAuthService.introspectToken(requireString(req.body.token, 'token')));
  } catch (err) {
    next(err);
  }
}

export async function revoke(req: Request, res: Response, next: NextFunction) {
  try {
    await OAuthService.revokeToken(
      requireString(req.body.token, 'token'),
      readString(req.body.token_type_hint),
    );
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
}

export async function rotateKey(_req: Request, res: Response, next: NextFunction) {
  try {
    const key = await OAuthService.rotateSigningKey();
    res.json({
      success: true,
      data: {
        kid: key.kid,
        alg: key.alg,
        status: key.status,
        createdAt: key.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
