import Redis from 'ioredis'

/** Redis client singleton */
let redis: Redis

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
  }
  return redis
}
