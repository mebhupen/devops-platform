
const knexLib = require('knex');
const path = require('path');
const { logger } = require('./logger');

let knex;

const getKnexConfig = () => ({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
  migrations: {
    directory: path.join(__dirname, '../../database/migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.join(__dirname, '../../database/seeds')
  }
});

async function connectDB() {
  if (knex) return knex;
  knex = knexLib(getKnexConfig());
  try {
    await knex.raw('SELECT 1');
    logger.info('PostgreSQL connected');
  } catch (err) {
    logger.error('DB connection failed', err);
    throw err;
  }
  return knex;
}

async function runMigrations() {
  if (!knex) await connectDB();
  try {
    await knex.migrate.latest();
    logger.info('Migrations completed');
  } catch (err) {
    logger.error('Migration failed', err);
    throw err;
  }
}

module.exports = { connectDB, runMigrations, get knex() { return knex; } };
