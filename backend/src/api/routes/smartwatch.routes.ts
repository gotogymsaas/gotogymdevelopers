import { Router } from 'express';
import { getSmartwatchMetrics } from '../../controllers/smartwatch.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';

const router = Router();

router.get('/metrics', requireAuth, requirePermission('smartwatch:read'), getSmartwatchMetrics);

export default router;
