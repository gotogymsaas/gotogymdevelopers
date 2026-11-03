import { setStoredSession, type AuthSession, type AppPermission, type UserRole } from './rbac';
const verifierKey = 'gtg_identity_verifier';
// Developers identity endpoints are served by its own Node API, never by Coach's Django API.
// The legacy API may continue using VITE_API_URL while SSO remains opt-in.
const base = (): string => {
  const configured = window.__APP_ENV__?.VITE_IDENTITY_API_URL?.trim();
  if (!configured) throw new Error('identity_backend_unconfigured');
  let url: URL;
  try { url = new URL(configured); }
  catch { throw new Error('identity_backend_invalid'); }
  const localDevelopment = (url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.protocol === 'http:';
  if ((!localDevelopment && url.protocol !== 'https:')
    || url.username || url.password || url.search || url.hash || url.pathname !== '/'
    || url.hostname === 'api.gotogym.store') {
    throw new Error('identity_backend_invalid');
  }
  return url.origin + '/api/v1/auth/identity';
};
export async function identityAvailable(): Promise<boolean> {
  try { const r = await fetch(base() + '/status', { cache: 'no-store' }); return r.ok && (await r.json()).enabled === true; } catch { return false; }
}
export async function startIdentity() {
  const endpoint = base(); // Refuse to initiate a flow before configuration is valid.
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const encode = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const verifier = encode(bytes);
  const challenge = encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  sessionStorage.setItem(verifierKey, verifier);
  window.location.assign(endpoint + '/start?challenge=' + encodeURIComponent(challenge));
}
export async function finishIdentity(): Promise<boolean> {
  const ticket = new URLSearchParams(window.location.hash.slice(1)).get('sso_ticket');
  if (!ticket) return false;
  history.replaceState(null, '', location.pathname + location.search);
  const verifier = sessionStorage.getItem(verifierKey);
  sessionStorage.removeItem(verifierKey);
  if (!verifier) throw new Error('Inicia nuevamente el acceso con GoToGym en esta pestaña.');
  const response = await fetch(base() + '/exchange', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticket, verifier }) });
  if (!response.ok) throw new Error('No se pudo completar el acceso. Verifica que tu cuenta tenga acceso a Developers.');
  const payload = await response.json(); const d = payload.data;
  const roles: Record<string, UserRole> = { end_user: 'user', company_owner: 'gym', company_manager: 'gym', integrator: 'user', gotogym_admin: 'admin' };
  const mapping: Record<string, AppPermission> = { 'integrations:read:self': 'integrations:read', 'integrations:read:organization': 'integrations:read', 'integrations:sync:organization': 'integrations:sync', 'bodygraph:read:self': 'bodygraph:read', 'smartwatch:read:self': 'smartwatch:read', 'corporate_wellbeing:read:organization': 'business:wellbeing:read', 'admin_console:manage:platform': 'admin:modules:read' };
  if (!d?.token || !roles[d.role] || !Array.isArray(d.user?.scopes)) throw new Error('Respuesta de identidad inválida.');
  const session: AuthSession = { token: d.token, role: roles[d.role], email: d.user.email, tenant: d.user.tenant, permissions: d.user.scopes.map((s: string) => mapping[s]).filter(Boolean) };
  setStoredSession(session); return true;
}
