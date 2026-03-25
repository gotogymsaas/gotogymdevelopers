const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

app.listen(config.port, () => {
  logger.info(`Servidor escuchando en puerto ${config.port} (${config.env})`);
});
