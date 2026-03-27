import express from 'express';
import integrationRoutes from './api/routes/integration.routes';
import bodygraphRoutes from './api/routes/bodygraph.routes';
import { errorHandler } from './api/middlewares/error.middleware';

const app = express();
app.use(express.json());

// Futuro: app.use(authMiddleware)

app.use('/api/integrations', integrationRoutes);
app.use('/api/bodygraph', bodygraphRoutes);

// Manejo centralizado de errores
app.use(errorHandler);

export default app;
