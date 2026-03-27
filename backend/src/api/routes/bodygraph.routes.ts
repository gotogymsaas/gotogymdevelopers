import { Router } from 'express';
import { getBodyGraph } from '../controllers/bodygraph.controller';

const router = Router();

router.get('/:integrationId', getBodyGraph);

export default router;
