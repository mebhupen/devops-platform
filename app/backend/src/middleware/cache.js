
const { redis } = require('../config/redis');
const { logger } = require('../config/logger');

// Non-blocking pattern-based key lookup. Redis's KEYS command is O(N) over the
// entire keyspace and blocks the event loop while it runs - unsafe in
// production once the keyspace grows. SCAN walks the keyspace incrementally
// without blocking other clients.
async function scanKeys(pattern) {
  const found = [];
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;
    found.push(...keys);
  } while (cursor !== '0');
  return found;
}

function cacheMiddleware(keyPrefix, ttl = 60) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    try {
      const cacheKey = `${keyPrefix}:${req.originalUrl}:${req.user?.id || 'anon'}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache HIT ${cacheKey}`);
        return res.json(JSON.parse(cached));
      }
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try { await redis.setex(cacheKey, ttl, JSON.stringify(body)); } catch(e) {}
        return originalJson(body);
      };
      next();
    } catch (err) {
      next();
    }
  };
}

async function invalidateCache(pattern) {
  try {
    const keys = await scanKeys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch (e) {}
}

module.exports = { cacheMiddleware, invalidateCache, scanKeys };
