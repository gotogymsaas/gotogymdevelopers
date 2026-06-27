import { Router } from 'express';
import { getCorporateWellbeing } from '../../controllers/corporate-wellbeing.controller';
import { requireAuth, requireOrganizationAccess, requireRole, requireScope } from '../middlewares/auth.middleware';

const router = Router();

router.options('/corporate', (_req, res) => {
  res.sendStatus(200);
});

router.get(
  '/corporate',
  requireAuth,
  requireRole('company_owner', 'company_manager', 'gotogym_admin'),
  requireScope('corporate_wellbeing:read:organization'),
  requireOrganizationAccess(req => {
    const org = typeof req.query.org === 'string' ? req.query.org.trim() : '';
    return org || req.authUser?.tenant.organizationId;
  }),
  getCorporateWellbeing,
);

export default router;
