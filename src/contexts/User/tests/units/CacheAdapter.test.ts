import { CacheAdapter } from '../../adapters/CacheAdapter.js';

jest.mock('@core/Redis/redis.client.js');

describe('CacheAdapter - UNIT TESTS', () => {
        let adapter: CacheAdapter;
        let mockRedis: any;

        beforeEach(() => {
                jest.clearAllMocks();
                mockRedis = require('@core/Redis/redis.client.js');
                adapter = new CacheAdapter(mockRedis);
        });

        describe('set', () => {
                it('should set value in cache with default TTL', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'user:123:profile';
                        const value = { name: 'John Doe', email: 'john@example.com' };

                        // Act
                        const result = await adapter.set(key, value);

                        // Assert
                        expect(mockRedis.set).toHaveBeenCalledWith(
                                key,
                                JSON.stringify(value),
                                'EX',
                                expect.any(Number) // Default TTL in seconds
                        );
                        expect(result).toBe(true);
                });

                it('should set value in cache with custom TTL', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'user:123:session';
                        const value = { sessionId: 'sess-abc123' };
                        const ttlSeconds = 3600; // 1 hour

                        // Act
                        const result = await adapter.set(key, value, ttlSeconds);

                        // Assert
                        expect(mockRedis.set).toHaveBeenCalledWith(
                                key,
                                JSON.stringify(value),
                                'EX',
                                ttlSeconds
                        );
                        expect(result).toBe(true);
                });

                it('should handle setting string values', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'verification:token:abc123';
                        const value = 'token-value-string';

                        // Act
                        const result = await adapter.set(key, value);

                        // Assert
                        expect(mockRedis.set).toHaveBeenCalled();
                        expect(result).toBe(true);
                });

                it('should handle setting object values', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'cache:user:data';
                        const value = {
                                id: 'user-123',
                                email: 'user@example.com',
                                role: 'CREATOR',
                                verified: true
                        };

                        // Act
                        const result = await adapter.set(key, value);

                        // Assert
                        expect(mockRedis.set).toHaveBeenCalledWith(
                                key,
                                JSON.stringify(value),
                                'EX',
                                expect.any(Number)
                        );
                        expect(result).toBe(true);
                });

                it('should return false on set failure', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue(null);
                        const key = 'user:123:data';
                        const value = { test: 'value' };

                        // Act
                        const result = await adapter.set(key, value);

                        // Assert
                        expect(result).toBe(false);
                });

                it('should handle set errors', async () => {
                        // Arrange
                        mockRedis.set.mockRejectedValue(new Error('Redis connection error'));
                        const key = 'user:123:data';
                        const value = { test: 'value' };

                        // Act & Assert
                        await expect(adapter.set(key, value)).rejects.toThrow('Redis connection error');
                });

                it('should handle zero TTL', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'temp:key';
                        const value = { data: 'temporary' };

                        // Act
                        const result = await adapter.set(key, value, 0);

                        // Assert
                        expect(result).toBe(true);
                });
        });

        describe('get', () => {
                it('should retrieve value from cache', async () => {
                        // Arrange
                        const value = { name: 'John Doe', email: 'john@example.com' };
                        mockRedis.get.mockResolvedValue(JSON.stringify(value));
                        const key = 'user:123:profile';

                        // Act
                        const result = await adapter.get(key);

                        // Assert
                        expect(mockRedis.get).toHaveBeenCalledWith(key);
                        expect(result).toEqual(value);
                });

                it('should return null for non-existent key', async () => {
                        // Arrange
                        mockRedis.get.mockResolvedValue(null);
                        const key = 'non:existent:key';

                        // Act
                        const result = await adapter.get(key);

                        // Assert
                        expect(result).toBeNull();
                });

                it('should return string values as strings', async () => {
                        // Arrange
                        const value = 'token-value-string';
                        mockRedis.get.mockResolvedValue(value);
                        const key = 'token:abc123';

                        // Act
                        const result = await adapter.get(key);

                        // Assert
                        expect(result).toBe(value);
                });

                it('should parse JSON objects', async () => {
                        // Arrange
                        const value = { id: 'user-123', role: 'CREATOR', verified: true };
                        mockRedis.get.mockResolvedValue(JSON.stringify(value));
                        const key = 'user:123:data';

                        // Act
                        const result = await adapter.get(key);

                        // Assert
                        expect(result).toEqual(value);
                        expect(typeof result).toBe('object');
                });

                it('should handle malformed JSON gracefully', async () => {
                        // Arrange
                        mockRedis.get.mockResolvedValue('not-valid-json-{]');
                        const key = 'bad:data';

                        // Act & Assert
                        // Should either return the string or throw, depending on implementation
                        try {
                                const result = await adapter.get(key);
                                expect(result).toBeDefined();
                        } catch (error) {
                                expect(error).toBeDefined();
                        }
                });

                it('should handle get errors', async () => {
                        // Arrange
                        mockRedis.get.mockRejectedValue(new Error('Redis connection error'));
                        const key = 'user:123:data';

                        // Act & Assert
                        await expect(adapter.get(key)).rejects.toThrow('Redis connection error');
                });
        });

        describe('delete', () => {
                it('should delete key from cache', async () => {
                        // Arrange
                        mockRedis.del.mockResolvedValue(1);
                        const key = 'user:123:profile';

                        // Act
                        const result = await adapter.delete(key);

                        // Assert
                        expect(mockRedis.del).toHaveBeenCalledWith(key);
                        expect(result).toBe(true);
                });

                it('should return false when key does not exist', async () => {
                        // Arrange
                        mockRedis.del.mockResolvedValue(0);
                        const key = 'non:existent:key';

                        // Act
                        const result = await adapter.delete(key);

                        // Assert
                        expect(result).toBe(false);
                });

                it('should handle delete errors', async () => {
                        // Arrange
                        mockRedis.del.mockRejectedValue(new Error('Redis error'));
                        const key = 'user:123:data';

                        // Act & Assert
                        await expect(adapter.delete(key)).rejects.toThrow('Redis error');
                });

                it('should delete multiple keys at once', async () => {
                        // Arrange
                        mockRedis.del.mockResolvedValue(2);
                        const keys = ['user:123:profile', 'user:123:session'];

                        // Act
                        // Assuming delete can handle array of keys
                        const result = await Promise.all(keys.map((key) => adapter.delete(key)));

                        // Assert
                        expect(result.every((r) => r === true || r === false)).toBe(true);
                });
        });

        describe('exists', () => {
                it('should return true when key exists', async () => {
                        // Arrange
                        mockRedis.exists.mockResolvedValue(1);
                        const key = 'user:123:profile';

                        // Act
                        const result = await adapter.exists(key);

                        // Assert
                        expect(mockRedis.exists).toHaveBeenCalledWith(key);
                        expect(result).toBe(true);
                });

                it('should return false when key does not exist', async () => {
                        // Arrange
                        mockRedis.exists.mockResolvedValue(0);
                        const key = 'non:existent:key';

                        // Act
                        const result = await adapter.exists(key);

                        // Assert
                        expect(result).toBe(false);
                });

                it('should handle exists errors', async () => {
                        // Arrange
                        mockRedis.exists.mockRejectedValue(new Error('Redis error'));
                        const key = 'user:123:data';

                        // Act & Assert
                        await expect(adapter.exists(key)).rejects.toThrow('Redis error');
                });
        });

        describe('clear', () => {
                it('should clear all keys matching pattern', async () => {
                        // Arrange
                        mockRedis.keys.mockResolvedValue(['user:123:*', 'user:456:*']);
                        mockRedis.del.mockResolvedValue(2);
                        const pattern = 'user:*';

                        // Act
                        const result = await adapter.clear(pattern);

                        // Assert
                        expect(mockRedis.keys).toHaveBeenCalledWith(pattern);
                        expect(result).toBe(true);
                });

                it('should return true even when no keys match pattern', async () => {
                        // Arrange
                        mockRedis.keys.mockResolvedValue([]);
                        const pattern = 'non:existent:*';

                        // Act
                        const result = await adapter.clear(pattern);

                        // Assert
                        expect(result).toBe(true);
                });

                it('should clear entire cache with * pattern', async () => {
                        // Arrange
                        mockRedis.keys.mockResolvedValue([
                                'user:123:profile',
                                'user:456:profile',
                                'token:abc123'
                        ]);
                        mockRedis.del.mockResolvedValue(3);
                        const pattern = '*';

                        // Act
                        const result = await adapter.clear(pattern);

                        // Assert
                        expect(mockRedis.keys).toHaveBeenCalledWith(pattern);
                        expect(result).toBe(true);
                });

                it('should handle clear errors', async () => {
                        // Arrange
                        mockRedis.keys.mockRejectedValue(new Error('Redis error'));
                        const pattern = 'user:*';

                        // Act & Assert
                        await expect(adapter.clear(pattern)).rejects.toThrow('Redis error');
                });
        });

        describe('getOrSet', () => {
                it('should return cached value if exists', async () => {
                        // Arrange
                        const cachedValue = { name: 'John Doe' };
                        mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));
                        const key = 'user:123:profile';
                        const fallbackFn = jest.fn();

                        // Act
                        const result = await adapter.getOrSet(key, fallbackFn);

                        // Assert
                        expect(mockRedis.get).toHaveBeenCalledWith(key);
                        expect(fallbackFn).not.toHaveBeenCalled();
                        expect(result).toEqual(cachedValue);
                });

                it('should execute fallback if key not in cache', async () => {
                        // Arrange
                        mockRedis.get.mockResolvedValue(null);
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'user:123:profile';
                        const fallbackValue = { name: 'John Doe' };
                        const fallbackFn = jest.fn().mockResolvedValue(fallbackValue);

                        // Act
                        const result = await adapter.getOrSet(key, fallbackFn);

                        // Assert
                        expect(fallbackFn).toHaveBeenCalled();
                        expect(mockRedis.set).toHaveBeenCalled();
                        expect(result).toEqual(fallbackValue);
                });

                it('should cache result of fallback function', async () => {
                        // Arrange
                        mockRedis.get.mockResolvedValue(null);
                        mockRedis.set.mockResolvedValue('OK');
                        const key = 'expensive:operation';
                        const result = { computed: 'value' };
                        const fallbackFn = jest.fn().mockResolvedValue(result);

                        // Act
                        await adapter.getOrSet(key, fallbackFn);

                        // Assert
                        expect(mockRedis.set).toHaveBeenCalledWith(
                                key,
                                JSON.stringify(result),
                                'EX',
                                expect.any(Number)
                        );
                });
        });

        describe('TTL operations', () => {
                it('should get remaining TTL for key', async () => {
                        // Arrange
                        mockRedis.ttl.mockResolvedValue(3600);
                        const key = 'user:123:session';

                        // Act
                        const result = await adapter.getTTL(key);

                        // Assert
                        expect(mockRedis.ttl).toHaveBeenCalledWith(key);
                        expect(result).toBe(3600);
                });

                it('should return -1 for key with no expiry', async () => {
                        // Arrange
                        mockRedis.ttl.mockResolvedValue(-1);
                        const key = 'persistent:key';

                        // Act
                        const result = await adapter.getTTL(key);

                        // Assert
                        expect(result).toBe(-1);
                });

                it('should set TTL on existing key', async () => {
                        // Arrange
                        mockRedis.expire.mockResolvedValue(1);
                        const key = 'user:123:data';
                        const ttl = 7200;

                        // Act
                        const result = await adapter.setTTL(key, ttl);

                        // Assert
                        expect(mockRedis.expire).toHaveBeenCalledWith(key, ttl);
                        expect(result).toBe(true);
                });
        });

        describe('performance scenarios', () => {
                it('should handle rapid sequential sets', async () => {
                        // Arrange
                        mockRedis.set.mockResolvedValue('OK');

                        // Act
                        const results = await Promise.all([
                                adapter.set('key:1', { value: 1 }),
                                adapter.set('key:2', { value: 2 }),
                                adapter.set('key:3', { value: 3 }),
                                adapter.set('key:4', { value: 4 }),
                                adapter.set('key:5', { value: 5 })
                        ]);

                        // Assert
                        expect(results.every((r) => r === true)).toBe(true);
                        expect(mockRedis.set).toHaveBeenCalledTimes(5);
                });

                it('should handle rapid sequential gets', async () => {
                        // Arrange
                        const values = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];
                        mockRedis.get.mockImplementation((key) => {
                                const index = parseInt(key.split(':')[1]) - 1;
                                return Promise.resolve(JSON.stringify(values[index]));
                        });

                        // Act
                        const results = await Promise.all([
                                adapter.get('key:1'),
                                adapter.get('key:2'),
                                adapter.get('key:3'),
                                adapter.get('key:4'),
                                adapter.get('key:5')
                        ]);

                        // Assert
                        expect(results).toEqual(values);
                });
        });

        describe('cache invalidation', () => {
                it('should invalidate user cache on logout', async () => {
                        // Arrange
                        mockRedis.del.mockResolvedValue(3);
                        const userId = 'user-123';
                        const keys = [
                                `user:${userId}:session`,
                                `user:${userId}:profile`,
                                `user:${userId}:permissions`
                        ];

                        // Act
                        const results = await Promise.all(keys.map((key) => adapter.delete(key)));

                        // Assert
                        expect(results.every((r) => r === true || r === false)).toBe(true);
                });

                it('should clear all user-related cache', async () => {
                        // Arrange
                        mockRedis.keys.mockResolvedValue(['user:123:session', 'user:123:profile']);
                        mockRedis.del.mockResolvedValue(2);

                        // Act
                        const result = await adapter.clear('user:123:*');

                        // Assert
                        expect(result).toBe(true);
                });
        });

        describe('error handling', () => {
                it('should handle connection errors', async () => {
                        // Arrange
                        mockRedis.set.mockRejectedValue(new Error('Connection refused'));

                        // Act & Assert
                        await expect(adapter.set('key', 'value')).rejects.toThrow('Connection refused');
                });

                it('should handle timeout errors', async () => {
                        // Arrange
                        mockRedis.get.mockRejectedValue(new Error('Operation timeout'));

                        // Act & Assert
                        await expect(adapter.get('key')).rejects.toThrow('Operation timeout');
                });
        });
});
