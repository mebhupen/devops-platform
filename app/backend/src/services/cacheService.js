
const { redis } = require('../config/redis');
async function get(key) { try { const v = await redis.get(key); return v ? JSON.parse(v) : null; } catch { return null; } }
async function set(key, value, ttl=60) { try { await redis.setex(key, ttl, JSON.stringify(value)); } catch {} }

// SCAN instead of KEYS - KEYS blocks the Redis event loop (O(N) over the whole
// keyspace) and this runs on every project/deployment/notification write.
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

async function del(pattern) {
  try {
    const keys = await scanKeys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch {}
}
module.exports = { get, set, del };
