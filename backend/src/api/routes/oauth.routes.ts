import { Router } from 'express';
import {
  authorize,
  getJwks,
  getOpenIdConfiguration,
  introspect,
  revoke,
  rotateKey,
  token,
} from '../../controllers/oauth.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/.well-known/openid-configuration', getOpenIdConfiguration);
router.get('/.well-known/jwks.json', getJwks);
router.get('/authorize', requireAuth, authorize);
router.post('/token', token);
router.post('/introspect', introspect);
router.post('/revoke', revoke);
router.post('/keys/rotate', requireAuth, requireRole('gotogym_admin'), rotateKey);

export default router;
