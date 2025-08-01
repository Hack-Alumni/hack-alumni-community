import { type ExtractValue } from '@oyster/types';

// Environment Variables

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL as string;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN as string;

// Upstash Redis REST API client
let upstashRedis: any = null;

// Initialize Upstash Redis
if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  import('@upstash/redis').then(({ Redis: UpstashRedis }) => {
    upstashRedis = new UpstashRedis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });
  }).catch((error) => {
    console.error('Failed to initialize Upstash Redis:', error);
    throw new Error('Upstash Redis is required but failed to initialize');
  });
} else {
  throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required');
}

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
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.get(key);
  },
  set: async (key: string, value: string, ...args: any[]) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    // Handle expiration if provided
    if (args.length >= 2 && args[0] === 'EX') {
      const expires = args[1];
      return await upstashRedis.set(key, value, { ex: expires });
    }
    return await upstashRedis.set(key, value);
  },
  del: async (key: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.del(key);
  },
  keys: async (pattern: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    // Note: Upstash Redis doesn't support KEYS command for security reasons
    // This is a limitation - you may need to track keys differently
    console.warn('KEYS command not supported in Upstash Redis');
    return [];
  },
  incr: async (key: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.incr(key);
  },
  decr: async (key: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.decr(key);
  },
  expire: async (key: string, seconds: number) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.expire(key, seconds);
  },
  ttl: async (key: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.ttl(key);
  },
  smembers: async (key: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.smembers(key);
  },
  sismember: async (key: string, member: string) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.sismember(key, member);
  },
  sadd: async (key: string, ...members: string[]) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.sadd(key, ...members);
  },
  srem: async (key: string, ...members: string[]) => {
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }
    return await upstashRedis.srem(key, ...members);
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
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }

    const value = await upstashRedis.get(key);

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
    if (!upstashRedis) {
      throw new Error('Upstash Redis not initialized');
    }

    const value = JSON.stringify(data);

    if (expires) {
      return await upstashRedis.set(key, value, { ex: expires });
    } else {
      return await upstashRedis.set(key, value);
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
