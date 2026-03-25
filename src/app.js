const express = require('express');
const userRoutes = require('./user/user.routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
app.use(express.json());

// Rutas de dominio
app.use('/api/user', userRoutes);
// Futuro: app.use('/api/auth', require('./auth/auth.routes'));
// Futuro: app.use('/api/payment', require('./payment/payment.routes'));
// Futuro: app.use('/api/notification', require('./notification/notification.routes'));

// 404 handler
app.use((req, res) => {
  logger.error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
