import { Router } from 'express';
import { getSmartwatchMetrics } from '../../controllers/smartwatch.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/metrics', requireAuth, getSmartwatchMetrics);

export default router;
