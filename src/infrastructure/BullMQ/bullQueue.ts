import { Queue, Worker } from 'bullmq';
import { logger } from '../Winston/winston.js';
import { redis } from '../Redis/redis.js';

interface BullQueues {
        [key: string]: Queue;
}

/**
 * BullMQ Queue Manager
 * Singleton class for managing job queues with Redis connection
 */
export class BullQueueManager {
        private static instance: BullQueueManager | null = null;
        private queues: BullQueues = {};

        private constructor() {}

        /**
         * Get or create BullQueueManager singleton instance
         */
        public static getInstance(): BullQueueManager {
                if (!this.instance) {
                        this.instance = new BullQueueManager();
                }
                return this.instance;
        }

        /**
         * Create or get a queue by name
         */
        public createQueue(queueName: string): Queue {
                if (this.queues[queueName]) {
                        logger.debug(`Queue ${queueName} already exists`);
                        return this.queues[queueName];
                }

                try {
                        const connection = redis.getConnectionOptions();

                        if (!connection) {
                                throw new Error('Redis connection not available');
                        }

                        const queue = new Queue(queueName, {
                                connection: connection
                        });

                        queue.on('error', (error: Error) => {
                                logger.error(`Queue ${queueName} error:`, error);
                        });

                        this.queues[queueName] = queue;
                        logger.info(`Queue ${queueName} created successfully`);

                        return queue;
                } catch (error) {
                        logger.error(`Failed to create queue ${queueName}:`, error);
                        throw error;
                }
        }

        /**
         * Get an existing queue by name
         */
        public getQueue(queueName: string): Queue {
                const queue = this.queues[queueName];
                if (!queue) {
                        throw new Error(`Queue ${queueName} not found. Create it first using createQueue()`);
                }
                return queue;
        }

        /**
         * Get all created queues
         */
        public getAllQueues(): Queue[] {
                return Object.values(this.queues);
        }

        /**
         * Check if a queue exists
         */
        public queueExists(queueName: string): boolean {
                return !!this.queues[queueName];
        }

        /**
         * Close a specific queue by name
         */
        public async closeQueue(queueName: string): Promise<void> {
                try {
                        const queue = this.queues[queueName];
                        if (queue) {
                                await queue.close();
                                delete this.queues[queueName];
                                logger.info(`Queue ${queueName} closed successfully`);
                        }
                } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        logger.error(`Error closing queue ${queueName}:`, errorMessage);
                        throw error;
                }
        }

        /**
         * Close all queues gracefully
         */
        public async closeAllQueues(): Promise<void> {
                try {
                        const closePromises = Object.values(this.queues).map((queue) =>
                                queue
                                        .close()
                                        .then(() => logger.info(`Queue ${queue.name} closed`))
                                        .catch((err: Error) =>
                                                logger.error(`Error closing queue ${queue.name}:`, err)
                                        )
                        );

                        await Promise.all(closePromises);
                        this.queues = {};
                        logger.info('All queues closed successfully');
                } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        logger.error(`Error closing all queues: ${errorMessage}`);
                        throw error;
                }
        }
}

/**
 * Export singleton instance for immediate use
 */
export const queueManager = BullQueueManager.getInstance();

export { Queue, Worker };
