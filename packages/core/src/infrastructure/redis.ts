import { type ExtractValue } from '@hackcommunity/types';

// Environment Variables

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL as string;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN as string;
const REDIS_URL = process.env.REDIS_URL as string;

// Redis client (Upstash or local)
let redisClient: any = null;

// Initialize Redis
async function initializeRedis() {
  if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
    // Use Upstash Redis
    try {
      const { Redis: UpstashRedis } = await import('@upstash/redis');

      redisClient = new UpstashRedis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });
    } catch (error) {
      console.error('Failed to initialize Upstash Redis:', error);
      throw new Error('Upstash Redis is required but failed to initialize');
    }
  } else if (REDIS_URL) {
    // Use local Redis
    try {
      const { default: Redis } = await import('ioredis');

      redisClient = new Redis(REDIS_URL);
    } catch (error) {
      console.error('Failed to initialize local Redis:', error);
      throw new Error('Local Redis is required but failed to initialize');
    }
  } else {
    throw new Error(
      'Either UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, or REDIS_URL are required'
    );
  }
}

// Initialize Redis immediately
initializeRedis().catch(console.error);

// Types

export const RedisKey = {
  AIRMEET_ACCESS_TOKEN: 'airmeet:access_token',
  AIRTABLE_CONNECTIONS: 'airtable:connections',
  CRUNCHBASE_CONNECTIONS: 'crunchbase:connections',
  GOOGLE_GEOCODING_CONNECTIONS: 'google:connections:geocoding',
  SLACK_DEACTIVATE_CONNECTIONS: 'slack:connections:deactivate',
  SLACK_GET_BIRTHDATES_CONNECTIONS: 'slack:connections:get_birthdates',
  SLACK_GET_MESSAGE_CONNECTIONS: 'slack:connections:get_message',
  SLACK_INVITE_USER_CONNECTIONS: 'slack:connections:invite_user',
  SLACK_JOIN_CHANNEL_CONNECTIONS: 'slack:connections:join_channel',
} as const;

export type RedisKey = ExtractValue<typeof RedisKey>;

// Constants

export const ONE_MINUTE_IN_SECONDS = 60;
export const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
export const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;
export const ONE_WEEK_IN_SECONDS = ONE_DAY_IN_SECONDS * 7;

// Redis instance for compatibility with existing code
export const redis = {
  get: async (key: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.get(key);
  },
  set: async (key: string, value: string, ...args: any[]) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    // Handle expiration if provided
    if (args.length >= 2 && args[0] === 'EX') {
      const expires = args[1];

      // For local Redis (ioredis), use the correct syntax
      return await redisClient.set(key, value, 'EX', expires);
    }

    return await redisClient.set(key, value);
  },
  del: async (key: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.del(key);
  },
  keys: async (_pattern: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    // Note: Upstash Redis doesn't support KEYS command for security reasons
    // This is a limitation - you may need to track keys differently
    console.warn('KEYS command not supported in Upstash Redis');

    return [];
  },
  incr: async (key: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.incr(key);
  },
  decr: async (key: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.decr(key);
  },
  expire: async (key: string, seconds: number) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.expire(key, seconds);
  },
  ttl: async (key: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.ttl(key);
  },
  smembers: async (key: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.smembers(key);
  },
  sismember: async (key: string, member: string) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.sismember(key, member);
  },
  sadd: async (key: string, ...members: string[]) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.sadd(key, ...members);
  },
  srem: async (key: string, ...members: string[]) => {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    return await redisClient.srem(key, ...members);
  },
};

// Utils

export const cache = {
  /**
   * Gets the value stored in Redis and parses it as JSON. If the key does not
   * exist, it will return null.
   *
   * @param key - Key to retrieve the value from.
   */
  async get<T>(key: string) {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    const value = await redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  },

  /**
   * Stringifies the value and stores it in Redis. If an expiration time is
   * provided, the key will expire after that time.
   *
   * @param key - Key to store the value in.
   * @param data - JSON data to store in Redis.
   * @param expires - Time (in seconds) for the key to expire.
   */
  async set<T>(key: string, data: T, expires?: number) {
    if (!redisClient) {
      throw new Error('Redis not initialized');
    }

    const value = JSON.stringify(data);

    if (expires) {
      // For local Redis (ioredis), use the correct syntax
      return await redisClient.set(key, value, 'EX', expires);
    } else {
      return await redisClient.set(key, value);
    }
  },
};

/**
 * Returns the cached data if it exists and is valid. Otherwise, it will call
 * the provided function and store the result in Redis. The cache will expire
 * after the provided time.
 *
 * @param key - Key to store the data in Redis.
 * @param expires - Time in seconds for the cache to expire.
 * @param fn - Function to call if the cache is empty.
 */
export async function withCache<T>(
  key: string,
  expires: number | null,
  fn: () => T | Promise<T>
): Promise<T> {
  const data = await cache.get<T>(key);

  if (data) {
    return data;
  }

  const result = await fn();

  if (!result) {
    return result;
  }

  await cache.set(key, result, expires || undefined);

  return result;
}
