import { Router } from 'express';
import { getCorporateWellbeing } from '../../controllers/corporate-wellbeing.controller';

const router = Router();

router.options('/corporate', (_req, res) => {
  res.sendStatus(200);
});

router.get('/corporate', getCorporateWellbeing);

export default router;
