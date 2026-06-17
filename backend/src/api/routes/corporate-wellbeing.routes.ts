import { Router } from 'express';
import { getCorporateWellbeing } from '../../controllers/corporate-wellbeing.controller';
import { requireAuth, requirePermission, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.options('/corporate', (_req, res) => {
  res.sendStatus(200);
});

router.get(
  '/corporate',
  requireAuth,
  requireRole('gym', 'admin'),
  requirePermission('business:wellbeing:read'),
  getCorporateWellbeing,
);

export default router;
