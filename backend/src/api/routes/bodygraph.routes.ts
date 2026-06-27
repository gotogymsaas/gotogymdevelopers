import { Router } from 'express';
import { getBodyGraph } from '../../controllers/bodygraph.controller';
import { requireAuth, requireScope } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:integrationId', requireAuth, requireScope('bodygraph:read:self'), getBodyGraph);

export default router;
