import { CacheService } from '@core/Redis/cacheService.js';
import { ICachePort } from '../ports/ICache.js';
export class CacheAdapter implements ICachePort {
        async get<T>(key: string): Promise<T | null> {
                return CacheService.get<T>(key);
        }

        async set(key: string, value: any, ttl?: number): Promise<void> {
                await CacheService.set(key, value, ttl);
        }

        async delete(key: string): Promise<void> {
                await CacheService.delete(key);
        }

        async exists(key: string): Promise<boolean> {
                return await CacheService.exists(key);
        }
}
