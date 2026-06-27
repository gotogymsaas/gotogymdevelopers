import { Router } from 'express';
import { requireOAuthAccessToken } from '../../api/middlewares/oauth.middleware';
import {
  executeQAF,
  getCapabilities,
  getContext,
  getMetrics,
} from '../controllers/coach-integrations.controller';

const router = Router();

router.get('/capabilities', requireOAuthAccessToken('profile.read'), getCapabilities);
router.post('/context', requireOAuthAccessToken('wellbeing.read'), getContext);
router.post('/qaf/execute', requireOAuthAccessToken('wellbeing.read'), executeQAF);
router.get('/metrics/aggregate', requireOAuthAccessToken('analytics.read'), getMetrics);

export default router;
