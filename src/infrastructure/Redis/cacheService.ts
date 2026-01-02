import { redis } from './redis.js';
import { logger } from '../Winston/winston.js';

export class CacheService {
        private static readonly DEFAULT_TTL = 3600; // 1 hour

        /**
         * Set a value in cache
         * @param key - Cache key
         * @param value - Value to cache (will be stringified if object)
         * @param ttl - Time to live in seconds (default: 1 hour)
         */
        static async set(key: string, value: any, ttl: number = this.DEFAULT_TTL) {
                try {
                        const client = redis.getConnection();

                        if (client == null) return null;

                        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);

                        await client.setex(key, ttl, serializedValue);
                } catch (error) {
                        logger.error(`Cache set error for key ${key}:`, error);
                        // Don't throw - cache failures shouldn't break the app
                }
        }

        /**
         * Get a value from cache
         * @param key - Cache key
         * @returns Cached value or null
         */
        static async get<T>(key: string): Promise<T | null> {
                try {
                        const client = redis.getConnection();

                        if (client == null) return null;

                        const value = await client.get(key);

                        if (!value) return null;

                        try {
                                return JSON.parse(value) as T;
                        } catch {
                                return value as T;
                        }
                } catch (error) {
                        logger.error(`Cache get error for key ${key}:`, error);
                        return null;
                }
        }

        /**
         * Delete a cache key
         * @param key - Cache key
         */
        static async delete(key: string) {
                try {
                        const client = redis.getConnection();
                        if (client == null) return;

                        await client.del(key);
                } catch (error) {
                        logger.error(`Cache delete error for key ${key}:`, error);
                }
        }

        /**
         * Clear all cache matching a pattern
         * @param pattern - Key pattern (e.g., "user:*")
         */
        static async deletePattern(pattern: string): Promise<void> {
                try {
                        const client = redis.getConnection();
                        const keys = await client.keys(pattern);
                        if (keys.length > 0) {
                                await client.del(keys);
                        }
                } catch (error) {
                        logger.error(`Cache delete pattern error for pattern ${pattern}:`, error);
                }
        }

        /**
         * Check if key exists in cache
         * @param key - Cache key
         */
        static async exists(key: string): Promise<boolean> {
                try {
                        const client = redis.getConnection();
                        const exists = await client.exists(key);
                        return exists === 1;
                } catch (error) {
                        logger.error(`Cache exists error for key ${key}:`, error);
                        return false;
                }
        }

        /**
         * Increment a numeric value
         * @param key - Cache key
         * @param increment - Amount to increment
         */
        static async increment(key: string, increment: number = 1): Promise<number> {
                try {
                        const client = redis.getConnection();
                        return await client.incrby(key, increment);
                } catch (error) {
                        logger.error(`Cache increment error for key ${key}:`, error);
                        throw error;
                }
        }

        /**
         * Set expiry on a key
         * @param key - Cache key
         * @param ttl - Time to live in seconds
         */
        static async expire(key: string, ttl: number): Promise<void> {
                try {
                        const client = redis.getConnection();
                        await client.expire(key, ttl);
                } catch (error) {
                        logger.error(`Cache expire error for key ${key}:`, error);
                }
        }
}
