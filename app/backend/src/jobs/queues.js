
const { Queue } = require('bullmq');
const { redis } = require('../config/redis');
const { logger } = require('../config/logger');

let queues = {};

function initQueues() {
  const connection = require('../config/redis').redis;
  queues.emailQueue = new Queue('emailQueue', { connection });
  queues.notificationQueue = new Queue('notificationQueue', { connection });
  queues.deploymentQueue = new Queue('deploymentQueue', { connection });
  queues.cleanupQueue = new Queue('cleanupQueue', { connection });
  logger.info('BullMQ queues initialized');
  return queues;
}

async function addJob(queueName, jobName, data, opts={}) {
  const q = queues[queueName];
  if (!q) return null;
  return q.add(jobName, data, { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 100, removeOnFail: 50, ...opts });
}

module.exports = { initQueues, addJob, get queues() { return queues; } };
