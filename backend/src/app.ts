import express from 'express';
import integrationRoutes from './api/routes/integration.routes';
import bodygraphRoutes from './api/routes/bodygraph.routes';

const app = express();
app.use(express.json());

app.use('/api/integrations', integrationRoutes);
app.use('/api/bodygraph', bodygraphRoutes);

export default app;
