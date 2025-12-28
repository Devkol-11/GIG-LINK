import { redis } from './Redis/redis.js';
import { queueManager } from './BullMQ/bullQueue.js';
import { bullEventBus } from './BullMQ/BullEventBus.js';
import { logger } from './Winston/winston.js';

export class InfrastructureManager {
        async initialize(): Promise<void> {
                try {
                        await redis.initialize();
                        bullEventBus.startListener();
                        logger.info('Infrastructure initialized successfully');
                } catch (error) {
                        logger.error('Failed to initialize infrastructure:', error);
                        throw error;
                }
        }

        async close(): Promise<void> {
                try {
                        await queueManager.closeAllQueues();
                        await redis.disconnect();
                        logger.info('Infrastructure closed successfully');
                } catch (error) {
                        logger.error('Error closing infrastructure:', error);
                }
        }
}

export const infrastructureManager = new InfrastructureManager();
