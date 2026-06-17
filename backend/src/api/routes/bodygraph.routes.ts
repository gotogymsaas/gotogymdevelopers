import { Router } from 'express';
import { getBodyGraph } from '../../controllers/bodygraph.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:integrationId', requireAuth, requirePermission('bodygraph:read'), getBodyGraph);

export default router;
