import { Router } from 'express';
import {
  createApplication,
  disableApplication,
  getApplications,
  regenerateClientSecret,
  updateApplication,
} from '../../controllers/application.controller';
import { requireAuth, requireRole, requireScope } from '../middlewares/auth.middleware';

const router = Router();

router.use(
  requireAuth,
  requireRole('company_owner', 'company_manager', 'gotogym_admin'),
  requireScope('applications:manage:organization'),
);

router.get('/', getApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.post('/:id/disable', disableApplication);
router.post('/:id/regenerate-secret', regenerateClientSecret);

export default router;

