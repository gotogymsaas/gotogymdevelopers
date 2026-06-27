import { Router } from 'express';
import { getIntegrations, syncIntegration } from '../../controllers/integration.controller';
import { requireAuth, requireScope } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, requireScope('integrations:read:organization'), getIntegrations);
router.post('/:id/sync', requireAuth, requireScope('integrations:sync:organization'), syncIntegration);

export default router;
