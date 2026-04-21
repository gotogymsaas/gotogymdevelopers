import express from 'express';
import cors from 'cors';
import integrationRoutes from './api/routes/integration.routes';
import bodygraphRoutes from './api/routes/bodygraph.routes';
import smartwatchRoutes from './api/routes/smartwatch.routes';
import authRoutes from './api/routes/auth.routes';
import { errorHandler } from './api/middlewares/error.middleware';

const allowedOrigins = [
  'https://developers.gotogym.store',
  'http://localhost:5173',
];

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Futuro: app.use(authMiddleware)

app.use('/api/integrations', integrationRoutes);
app.use('/api/bodygraph', bodygraphRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/smartwatch', smartwatchRoutes);

// Manejo centralizado de errores
app.use(errorHandler);

export default app;
