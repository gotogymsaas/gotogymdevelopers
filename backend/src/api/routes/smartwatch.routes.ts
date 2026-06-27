import { Router } from 'express';
import { getSmartwatchMetrics } from '../../controllers/smartwatch.controller';
import { requireAuth, requireScope } from '../middlewares/auth.middleware';

const router = Router();

router.get('/metrics', requireAuth, requireScope('smartwatch:read:self'), getSmartwatchMetrics);

export default router;
