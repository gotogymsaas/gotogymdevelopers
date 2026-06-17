import { Router } from 'express';
import { getIntegrations, syncIntegration } from '../../controllers/integration.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, requirePermission('integrations:read'), getIntegrations);
router.post('/:id/sync', requireAuth, requirePermission('integrations:sync'), syncIntegration);

export default router;
