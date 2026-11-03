/** First-party OIDC client. It is deliberately separate from /oauth (third-party IdP). */
import { createHash, createPublicKey, randomBytes, timingSafeEqual } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { saveFlow, consumeFlow, saveTicket, consumeTicket, identityStoreReady } from '../repositories/identity.repository';
import { issueIdentitySession } from './auth.service';
import type { AuthUser } from '../types/auth';

export type IdentityFlow = { state: string; browserHash: string; verifier: string; nonce: string; challenge: string; expires: number };
export type IdentityTicket = { hash: string; subject: string; challenge: string; expires: number };
const digest = (value: string) => createHash('sha256').update(value).digest('base64url');
const random = () => randomBytes(32).toString('base64url');
const equal = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export const enabled = () => process.env.OIDC_ENABLED === 'true';
const httpsUrl = (value: string | undefined) => {
  const u = new URL(value || '');
  if (u.protocol !== 'https:' || u.username || u.password || u.hash) throw new Error('identity_configuration');
  return u.toString();
};
export function config() {
  if (!enabled()) throw new Error('identity_disabled');
  if (process.env.NODE_ENV !== 'test' && !process.env.OIDC_DATABASE_URL) throw new Error('identity_database_not_configured');
  const issuer = process.env.OIDC_ISSUER || '';
  httpsUrl(issuer);
  const redirect = httpsUrl(process.env.OIDC_REDIRECT_URI);
  const frontend = httpsUrl(process.env.OIDC_FRONTEND_CALLBACK);
  const clientId = process.env.OIDC_CLIENT_ID;
  const secret = process.env.OIDC_CLIENT_SECRET;
  if (!clientId || !secret || secret.startsWith('@Microsoft.KeyVault')) throw new Error('identity_configuration');
  return { issuer, redirect, frontend, clientId, secret };
}
async function jsonFetch(url: string, init: RequestInit = {}) {
  const response = await fetch(httpsUrl(url), { ...init, redirect: 'error', signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('identity_provider_unavailable');
  return response.json() as Promise<any>;
}
async function metadata() {
  const c = config();
  const m = await jsonFetch(process.env.OIDC_DISCOVERY_URL || c.issuer.replace(/\/$/, '') + '/.well-known/openid-configuration');
  if (m.issuer !== c.issuer) throw new Error('identity_issuer');
  for (const k of ['authorization_endpoint', 'token_endpoint', 'jwks_uri']) httpsUrl(m[k]);
  return m;
}
/**
 * Fail closed before advertising SSO to browsers. A feature flag by itself is
 * not evidence that secrets, PostgreSQL migrations and the IdP are usable.
 * An abbreviated 15s cache and one in-flight promise prevent public status
 * polling from repeatedly contacting Entra or exhausting the DB pool.
 */
const readinessTtlMs = 15000;
let cachedReadiness: { key: string; until: number; ready: boolean } | undefined;
let pendingReadiness: { key: string; check: Promise<boolean> } | undefined;

export async function readiness(): Promise<boolean> {
  if (!enabled()) return false;
  // Avoid storing client secrets or connection strings in cache keys.
  const key = digest([
    process.env.NODE_ENV, process.env.OIDC_ENABLED, process.env.OIDC_ISSUER,
    process.env.OIDC_DISCOVERY_URL, process.env.OIDC_CLIENT_ID,
    process.env.OIDC_CLIENT_SECRET, process.env.OIDC_REDIRECT_URI,
    process.env.OIDC_FRONTEND_CALLBACK, process.env.OIDC_DATABASE_URL,
    process.env.OIDC_BINDINGS_JSON,
  ].join('\\0'));
  if (cachedReadiness?.key === key && cachedReadiness.until > Date.now()) {
    return cachedReadiness.ready;
  }
  if (pendingReadiness?.key === key) return pendingReadiness.check;
  const check = (async (): Promise<boolean> => {
    try {
      config();
      if (!process.env.OIDC_DATABASE_URL) return false;
      if (!Array.isArray(JSON.parse(process.env.OIDC_BINDINGS_JSON || '[]'))) return false;
      if (!(await identityStoreReady())) return false;
      await metadata(); // Exact issuer + HTTPS authorization, token and JWKS endpoints.
      return true;
    } catch {
      return false; // Never expose settings, tokens, connection strings or provider errors.
    }
  })();
  pendingReadiness = { key, check };
  try {
    const ready = await check;
    cachedReadiness = { key, until: Date.now() + readinessTtlMs, ready };
    return ready;
  } finally {
    if (pendingReadiness?.check === check) pendingReadiness = undefined;
  }
}

// Provisioning is explicit by stable issuer+oid. Token roles, email and tenant hints are never authority.
export function binding(subject: string): AuthUser {
  const c = config();
  const list = JSON.parse(process.env.OIDC_BINDINGS_JSON || '[]');
  if (!Array.isArray(list)) throw new Error('identity_bindings');
  const matches = list.filter(x => x.issuer === c.issuer && x.oid === subject && x.active === true);
  if (matches.length !== 1) throw new Error('identity_not_provisioned');
  const user = matches[0].user as AuthUser;
  if (user?.tokenType !== 'user') throw new Error('identity_bindings');
  // Shared validation with local JWT consumer, no new privilege interpretation.
  issueIdentitySession(user);
  return user;
}
export async function begin(challenge: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(challenge)) throw new Error('identity_challenge');
  const m = await metadata(); const c = config();
  const browser = random();
  const flow: IdentityFlow = { state: random(), browserHash: digest(browser), verifier: random(), nonce: random(), challenge, expires: Date.now() + 600000 };
  await saveFlow(flow);
  const url = new URL(m.authorization_endpoint);
  url.search = new URLSearchParams({ client_id: c.clientId, response_type: 'code', redirect_uri: c.redirect, scope: 'openid profile email', state: flow.state, nonce: flow.nonce, code_challenge: digest(flow.verifier), code_challenge_method: 'S256' }).toString();
  return { url: url.toString(), browser };
}
export async function complete(state: string, code: string, browser: string) {
  const f = await consumeFlow(state, digest(browser));
  const m = await metadata(); const c = config();
  const tokens = await jsonFetch(m.token_endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', client_id: c.clientId, client_secret: c.secret, code, redirect_uri: c.redirect, code_verifier: f.verifier }).toString() });
  if (typeof tokens.id_token !== 'string') throw new Error('identity_token');
  const decoded = jwt.decode(tokens.id_token, { complete: true });
  if (!decoded || decoded.header.alg !== 'RS256' || !decoded.header.kid) throw new Error('identity_algorithm');
  const jwks = await jsonFetch(m.jwks_uri);
  const keys = (jwks.keys || []).filter((k: any) => k.kid === decoded.header.kid && k.kty === 'RSA' && (!k.use || k.use === 'sig') && (!k.alg || k.alg === 'RS256'));
  if (keys.length !== 1) throw new Error('identity_key');
  const claims = jwt.verify(tokens.id_token, createPublicKey({ key: keys[0], format: 'jwk' }), { algorithms: ['RS256'], issuer: c.issuer, audience: c.clientId, clockTolerance: 60 }) as JwtPayload;
  if (typeof claims.exp !== 'number' || typeof claims.iat !== 'number' || claims.iat > Date.now() / 1000 + 60 || typeof claims.sub !== 'string' || !claims.sub || typeof claims.oid !== 'string' || !equal(String(claims.nonce || ''), f.nonce)) throw new Error('identity_claims');
  if ((Array.isArray(claims.aud) && claims.aud.length > 1 && claims.azp !== c.clientId) || (claims.azp && claims.azp !== c.clientId)) throw new Error('identity_azp');
  // When emitted, email_verified must be a real boolean true; strings and null are not proof.
  // Entra External ID may omit the claim, so deployment must separately verify the user flow.
  if (claims.email_verified !== undefined && claims.email_verified !== true) throw new Error('identity_email');
  binding(claims.oid);
  const ticket = random();
  await saveTicket({ hash: digest(ticket), subject: claims.oid, challenge: f.challenge, expires: Date.now() + 60000 });
  return c.frontend + '#sso_ticket=' + encodeURIComponent(ticket);
}
export async function exchange(ticket: string, verifier: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(ticket) || !/^[A-Za-z0-9_-]{43,128}$/.test(verifier)) throw new Error('identity_ticket');
  const subject = await consumeTicket(digest(ticket), digest(verifier));
  return issueIdentitySession(binding(subject));
}
export function frontendOrigin() { return new URL(config().frontend).origin; }

