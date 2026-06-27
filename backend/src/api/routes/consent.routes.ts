import { Router } from 'express';
import {
  authorizeConsent,
  getConsentHistory,
  getConsents,
  rejectConsent,
  revokeConsent,
} from '../../controllers/consent.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', getConsents);
router.get('/:id/history', getConsentHistory);
router.post('/:id/authorize', authorizeConsent);
router.post('/:id/reject', rejectConsent);
router.post('/:id/revoke', revokeConsent);

export default router;
