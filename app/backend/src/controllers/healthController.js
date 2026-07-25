const ApiResponse = require('../utils/ApiResponse');

async function checkDatabase() {
  try {
    // Re-require at call-time (not destructured at module load) - knex is
    // exposed via a getter that only returns a real connection after
    // connectDB() runs, which happens after this module is first loaded.
    const k = require('../config/database').knex;
    if (!k) return { status: 'fail', message: 'Not connected' };
    await k.raw('SELECT 1');
    return { status: 'ok', message: 'Connected' };
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
}

async function checkRedis() {
  try {
    const { redis } = require('../config/redis');
    if (!redis) return { status: 'skipped', message: 'Not configured' };
    await redis.ping();
    return { status: 'ok', message: 'Connected' };
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
}

async function health(req, res) {
  const dbCheck = await checkDatabase();
  const redisCheck = await checkRedis();
  
  const isHealthy = dbCheck.status === 'ok' && (redisCheck.status === 'ok' || redisCheck.status === 'skipped');
  const status = isHealthy ? 'ok' : 'degraded';
  
  const response = {
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '2.0.0',
    checks: {
      api: { status: 'ok', uptime: process.uptime() },
      database: dbCheck,
      redis: redisCheck
    }
  };
  
  const httpStatus = isHealthy ? 200 : 503;
  return res.status(httpStatus).json(response);
}

async function readiness(req, res) {
  const dbCheck = await checkDatabase();
  const redisCheck = await checkRedis();
  
  const isReady = dbCheck.status === 'ok' && (redisCheck.status === 'ok' || redisCheck.status === 'skipped');
  
  if (!isReady) {
    return res.status(503).json({
      status: 'fail',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck,
        redis: redisCheck
      },
      message: 'Service not ready'
    });
  }
  
  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {
      database: dbCheck,
      redis: redisCheck
    },
    message: 'Ready'
  });
}

async function liveness(req, res) {
  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'Alive'
  });
}

module.exports = { health, readiness, liveness };
