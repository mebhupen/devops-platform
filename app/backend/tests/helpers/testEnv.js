
const { connectDB } = require('../../src/config/database');
const { connectRedis } = require('../../src/config/redis');

async function setupTestEnv() {
  await connectDB();
  connectRedis();
}

async function teardownTestEnv() {
  const { knex } = require('../../src/config/database');
  const { redis } = require('../../src/config/redis');
  if (knex) await knex.destroy();
  if (redis) redis.disconnect();
}

async function truncateAll() {
  const { knex } = require('../../src/config/database');
  await knex.raw(
    'TRUNCATE TABLE notifications, deployments, projects, refresh_tokens, users RESTART IDENTITY CASCADE'
  );
}

module.exports = { setupTestEnv, teardownTestEnv, truncateAll };
