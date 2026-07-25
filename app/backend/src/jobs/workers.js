
const { Worker } = require('bullmq');
const { logger } = require('../config/logger');

function initWorkers() {
  const connection = require('../config/redis').redis;
  if (!connection) { logger.warn('Redis not ready, workers not started'); return; }

  const emailWorker = new Worker('emailQueue', async job => {
    const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
    const userRepo = require('../repositories/userRepository');
    if (job.name === 'verification') {
      const user = await userRepo.findById(job.data.userId);
      if (user) await sendVerificationEmail(user, job.data.token);
    } else if (job.name === 'passwordReset') {
      const user = await userRepo.findById(job.data.userId);
      if (user) await sendPasswordResetEmail(user, job.data.token);
    } else {
      logger.info(`Email job ${job.name}`, job.data);
    }
  }, { connection });

  const notificationWorker = new Worker('notificationQueue', async job => {
    const io = require('../realtime/socket').getIO();
    if (job.name === 'broadcast' && io) {
      const { notification } = job.data;
      io.to(`user:${notification.user_id}`).emit('notification:new', notification);
      io.emit('notification:global', notification);
    }
  }, { connection });

  const deploymentWorker = new Worker('deploymentQueue', async job => {
    const deploymentService = require('../services/deploymentService');
    const { getIO } = require('../realtime/socket');
    const io = getIO();
    logger.info(`Processing deployment ${job.data.deploymentId}`);
    // Simulate pipeline progress
    const statuses = ['cloning','building','testing','deploying','success'];
    for (const s of statuses) {
      await new Promise(r => setTimeout(r, 1500));
      await deploymentService.updateDeploymentStatus(job.data.deploymentId, s, io);
      if (io) io.to(`deployment:${job.data.deploymentId}`).emit('pipeline:progress', { deploymentId: job.data.deploymentId, status: s, progress: statuses.indexOf(s)*25 });
    }
  }, { connection });

  const cleanupWorker = new Worker('cleanupQueue', async job => {
    const { knex } = require('../config/database');
    if (job.name === 'cleanupTokens') {
      await knex('refresh_tokens').where('expires_at','<', new Date()).del();
      logger.info('Expired tokens cleaned');
    } else if (job.name === 'cleanupNotifications') {
      await knex('notifications').where('created_at','<', knex.raw("NOW() - INTERVAL '30 days'")).del();
      logger.info('Old notifications cleaned');
    }
  }, { connection });

  [emailWorker, notificationWorker, deploymentWorker, cleanupWorker].forEach(w => {
    w.on('failed', (job, err) => logger.error(`Worker ${w.name} job ${job.id} failed`, err));
  });

  logger.info('BullMQ workers initialized');
}

module.exports = { initWorkers };
