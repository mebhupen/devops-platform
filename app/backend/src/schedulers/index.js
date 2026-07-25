
const cron = require('node-cron');
const { logger } = require('../config/logger');
const { addJob } = require('../jobs/queues');

function initSchedulers() {
  // Every hour cleanup expired tokens
  cron.schedule('0 * * * *', async () => {
    logger.info('Scheduler: cleanup tokens');
    await addJob('cleanupQueue', 'cleanupTokens', {});
  });

  // Daily at 2 AM cleanup old notifications
  cron.schedule('0 2 * * *', async () => {
    logger.info('Scheduler: cleanup notifications');
    await addJob('cleanupQueue', 'cleanupNotifications', {});
  });

  // Daily report at 8 AM
  cron.schedule('0 8 * * *', async () => {
    logger.info('Scheduler: daily report - TODO implement report generation');
    // Could add job to generate daily report email
  });

  logger.info('Schedulers initialized');
}

module.exports = { initSchedulers };
