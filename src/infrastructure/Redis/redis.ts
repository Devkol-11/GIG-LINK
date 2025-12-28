import { Redis } from 'ioredis';
import { logger } from '../Winston/winston.js';
import { config } from '../EnvConfig/env.js';

export class RedisSingleton {
        private static instance: RedisSingleton | null = null;
        private redisClient: Redis;
        private isConnected: boolean = false;
        private connectionPromise: Promise<void> | null = null;

        private constructor() {}

        public static getInstance(): RedisSingleton {
                if (!this.instance) {
                        this.instance = new RedisSingleton();
                }
                return this.instance;
        }

        private createClient(): Redis {
                return new Redis({
                        host: config.REDIS_HOST || 'localhost',
                        port: Number(config.REDIS_PORT) || 6379,
                        password: config.REDIS_PASSWORD || undefined,
                        db: Number(config.REDIS_DB || 0),
                        tls: config.REDIS_HOST?.includes('cloud') ? { rejectUnauthorized: false } : undefined,
                        retryStrategy: (times) => {
                                const delay = Math.min(times * 50, 2000);
                                return delay;
                        },
                        maxRetriesPerRequest: 3,
                        connectTimeout: 10000,
                        commandTimeout: 5000,
                        enableReadyCheck: true,
                        enableOfflineQueue: true,
                        lazyConnect: true
                }) as unknown as Redis;
        }

        public async initialize(): Promise<void> {
                if (this.connectionPromise) {
                        return this.connectionPromise;
                }

                if (this.redisClient && this.isConnected) {
                        return;
                }

                this.connectionPromise = this.connect();
                return this.connectionPromise;
        }

        private connect(): Promise<void> {
                return new Promise((resolve, reject) => {
                        try {
                                if (!this.redisClient) {
                                        this.redisClient = this.createClient();
                                }

                                const timeout = setTimeout(() => {
                                        logger.error('Redis: Connection timeout after 10 seconds');
                                        this.connectionPromise = null;
                                        reject(new Error('Redis connection timeout'));
                                }, 10000);

                                const clearListeners = () => {
                                        this.redisClient?.removeAllListeners('connect');
                                        this.redisClient?.removeAllListeners('ready');
                                        this.redisClient?.removeAllListeners('error');
                                };

                                this.redisClient.on('connect', () => {
                                        logger.info('Redis: Connected successfully');
                                });

                                this.redisClient.on('ready', () => {
                                        clearTimeout(timeout);
                                        logger.info('Redis: Ready');
                                        this.isConnected = true;
                                        this.connectionPromise = null;
                                        resolve();
                                });

                                this.redisClient.on('error', (err) => {
                                        clearTimeout(timeout);
                                        clearListeners();
                                        logger.error(`Redis: Connection error - ${err.message}`);
                                        this.isConnected = false;
                                        this.connectionPromise = null;
                                        reject(err);
                                });

                                this.redisClient.on('close', () => {
                                        logger.warn('Redis: Connection closed');
                                        this.isConnected = false;
                                });

                                (this.redisClient as any).connect();
                        } catch (error) {
                                logger.error('Redis: Failed to create client', error);
                                this.connectionPromise = null;
                                reject(error);
                        }
                });
        }

        public isHealthy(): boolean {
                return this.isConnected && this.redisClient !== null;
        }

        public getConnection(): Redis | null {
                return this.redisClient;
        }

        public async disconnect(): Promise<void> {
                if (!this.redisClient) {
                        return;
                }

                try {
                        await (this.redisClient as any).quit();
                        logger.info('Redis: Disconnected');
                        this.isConnected = false;
                        this.redisClient = null;
                } catch (error) {
                        logger.error('Redis: Error during disconnect', error);
                }
        }

        public async flushAll(): Promise<void> {
                if (!this.redisClient) {
                        throw new Error('Redis: Not connected');
                }

                try {
                        await (this.redisClient as any).flushall();
                        logger.warn('Redis: All data flushed');
                } catch (error) {
                        logger.error('Redis: Error flushing data', error);
                        throw error;
                }
        }
}

export const redis = RedisSingleton.getInstance();
