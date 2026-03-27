import { Router } from 'express';
import { getIntegrations, syncIntegration } from '../controllers/integration.controller';

const router = Router();

router.get('/', getIntegrations);
router.post('/:id/sync', syncIntegration);

export default router;
