import { Router } from 'express';
import * as identity from '../../services/identity.service';
const router = Router();
router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); res.set('Referrer-Policy', 'no-referrer'); next(); });
router.get('/status', (_req, res) => res.json({ enabled: identity.enabled() }));
router.get('/start', async (req, res) => {
  try {
    const result = await identity.begin(String(req.query.challenge || ''));
    res.cookie('gtg_oidc_flow', result.browser, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/v1/auth/identity', maxAge: 600000 });
    res.redirect(result.url);
  } catch { res.status(identity.enabled() ? 503 : 404).json({ error: 'identity_start_failed' }); }
});
router.get('/callback', async (req, res) => {
  const cookie = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('gtg_oidc_flow='))?.slice('gtg_oidc_flow='.length) || '';
  res.clearCookie('gtg_oidc_flow', { secure: true, httpOnly: true, sameSite: 'lax', path: '/api/v1/auth/identity' });
  try {
    if (req.query.error || typeof req.query.code !== 'string' || typeof req.query.state !== 'string' || !cookie) throw new Error('flow');
    res.redirect(await identity.complete(req.query.state, req.query.code, cookie));
  } catch { res.status(400).json({ error: 'identity_callback_failed' }); }
});
router.post('/exchange', async (req, res) => {
  try {
    if (req.get('origin') !== identity.frontendOrigin()) { res.status(403).json({ error: 'identity_origin' }); return; }
    res.json({ success: true, data: await identity.exchange(String(req.body.ticket || ''), String(req.body.verifier || '')) });
  } catch { res.status(400).json({ error: 'identity_exchange_failed' }); }
});
export default router;
