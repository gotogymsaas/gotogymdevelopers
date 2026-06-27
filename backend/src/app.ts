import express from 'express';
import cors from 'cors';
import integrationRoutes from './api/routes/integration.routes';
import bodygraphRoutes from './api/routes/bodygraph.routes';
import smartwatchRoutes from './api/routes/smartwatch.routes';
import authRoutes from './api/routes/auth.routes';
import corporateWellbeingRoutes from './api/routes/corporate-wellbeing.routes';
import applicationRoutes from './api/routes/application.routes';
import consentRoutes from './api/routes/consent.routes';
import oauthRoutes from './api/routes/oauth.routes';
import coachIntegrationRoutes from './coach-integrations/routes/coach-integrations.routes';
import { errorHandler } from './api/middlewares/error.middleware';

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'https://developers.gotogym.store,http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const app = express();
app.use(cors({ origin: allowedOrigins, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Futuro: app.use(authMiddleware)

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'gotogym-developers-api',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/integrations', integrationRoutes);
app.use('/api/bodygraph', bodygraphRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/smartwatch', smartwatchRoutes);
app.use('/api/v1/business/wellbeing', corporateWellbeingRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/consents', consentRoutes);
app.use('/api/v1/coach-integrations', coachIntegrationRoutes);
app.use('/oauth', oauthRoutes);
app.use('/', oauthRoutes);

// Manejo centralizado de errores
app.use(errorHandler);

export default app;
