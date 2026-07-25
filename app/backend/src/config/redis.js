
const Redis = require('ioredis');
const { logger } = require('./logger');

let redis;

function connectRedis() {
  if (redis) return redis;
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times) {
      if (times > 10) return null;
      return Math.min(times * 100, 3000);
    }
  });
  redis.on('connect', () => logger.info('Redis connecting...'));
  redis.on('ready', () => logger.info('Redis ready'));
  redis.on('error', (err) => logger.error('Redis error', err));
  return redis;
}

module.exports = { connectRedis, get redis() { return redis; } };
