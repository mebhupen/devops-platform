require('dotenv').config();
const http = require('http');
const app = require('./app');
const { validateEnv } = require('./src/config/env');
const { connectDB, runMigrations } = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const logger = require('./src/config/logger').logger;
const { initSocket } = require('./src/realtime/socket');
const { initQueues, initWorkers } = require('./src/jobs');
const { initSchedulers } = require('./src/schedulers');

validateEnv();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    try {
      const { redis } = require('./src/config/redis');
      if (redis) await redis.quit();
      const { knex } = require('./src/config/database');
      if (knex) await knex.destroy();
      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', err);
      process.exit(1);
    }
  });
  setTimeout(() => {
    logger.error('Forced shutdown after 10s');
    process.exit(1);
  }, 10000);
};

['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => gracefulShutdown(sig)));
process.on('unhandledRejection', (err) => { logger.error('Unhandled Rejection', err); gracefulShutdown('unhandledRejection'); });
process.on('uncaughtException', (err) => { logger.error('Uncaught Exception', err); gracefulShutdown('uncaughtException'); });

(async () => {
  try {
    await connectDB();
    await runMigrations();
    await connectRedis();
    initQueues();
    initWorkers();
    initSchedulers();

    const io = initSocket(server);
    app.set('io', io);

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
})();
