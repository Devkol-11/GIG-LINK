import { redis } from './Redis/redis.js';
import { queueManager } from './BullMQ/bullQueue.js';
import { bullEventBus } from './BullMQ/BullEventBus.js';
import { logger } from './Winston/winston.js';
import { prismaDbProvider } from './Prisma/prisma.client.js';
import { pingDb } from './NodeCron/keep.alive.js';

export class InfrastructureManager {
        async initialize(): Promise<void> {
                try {
                        logger.info('connecting to the database...');
                        await prismaDbProvider.connectDB();
                        logger.info('database connected successfully...');
                        logger.info('connecting to redis');
                        await redis.initialize();
                        logger.info('redis connected successfully...');
                        logger.info('starting all listeners');
                        bullEventBus.startListener();
                        logger.info('all listerners fired up !');
                        logger.info('Infrastructure initialized successfully');
                        pingDb();
                } catch (error) {
                        logger.error('Failed to initialize infrastructure:', error);
                        throw error;
                }
        }

        async close(): Promise<void> {
                try {
                        await prismaDbProvider.disconnectDB();
                        await redis.disconnect();
                        await queueManager.closeAllQueues();
                        logger.info('Infrastructure closed successfully');
                } catch (error) {
                        logger.error('Error closing infrastructure:', error);
                }
        }
}

export const infrastructureManager = new InfrastructureManager();
