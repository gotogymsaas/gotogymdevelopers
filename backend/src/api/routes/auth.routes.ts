import { Router } from 'express';
import { login, me } from '../../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

import identityRoutes from './identity.routes';
const router = Router();
router.use('/identity', identityRoutes);

router.post('/login', login);
router.get('/me', requireAuth, me);

export default router;
