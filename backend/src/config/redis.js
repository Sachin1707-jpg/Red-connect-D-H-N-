const Redis = require('ioredis');

let redisClient = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('[Redis] REDIS_URL not set — BullMQ queue disabled. Notifications will be synchronous stubs.');
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      enableOfflineQueue: false,
      lazyConnect: true,
      retryStrategy: () => null, // Don't continuously reconnect if Redis server is down
    });

    redisClient.on('connect', () => console.log('[Redis] Connected'));
    redisClient.on('error', (err) => {
      // Print single quiet warning
      if (!redisClient._warned) {
        console.warn('[Redis] Not connected (Queue features disabled, synchronous fallback active).');
        redisClient._warned = true;
      }
    });

    return redisClient;
  } catch (err) {
    console.warn('[Redis] Init failed:', err.message);
    return null;
  }
};

module.exports = { getRedisClient };
