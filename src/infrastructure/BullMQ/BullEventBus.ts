import { queueManager, Worker } from './bullQueue.js';
import { logger } from '../Winston/winston.js';

interface EventHandler {
        (payload: any): Promise<void>;
}

interface EventListeners {
        [eventName: string]: EventHandler[];
}

export class BullEventBus {
        private listeners: EventListeners = {};

        private getEventQueue() {
                if (!queueManager.queueExists('events')) {
                        queueManager.createQueue('events');
                }
                return queueManager.getQueue('events');
        }

        /**
         * Publish an event to the queue
         * @param eventName - Name of the event
         * @param payload - Event payload
         */
        async publish(eventName: string, payload: any): Promise<void> {
                try {
                        const eventQueue = this.getEventQueue();
                        await eventQueue.add(eventName, payload, {
                                attempts: 3,
                                backoff: {
                                        type: 'exponential',
                                        delay: 2000
                                },
                                removeOnComplete: true,
                                removeOnFail: false
                        });

                        logger.info(`Event published: ${eventName}`, { payload });
                } catch (error) {
                        logger.error(`Failed to publish event ${eventName}:`, error);
                        throw error;
                }
        }

        /**
         * Subscribe to an event
         * @param eventName - Name of the event
         * @param handler - Event handler function
         */
        subscribe(eventName: string, handler: EventHandler): void {
                if (!this.listeners[eventName]) {
                        this.listeners[eventName] = [];
                }

                this.listeners[eventName].push(handler);
                logger.info(`Subscribed to event: ${eventName}`);
        }

        /**
         * Start listening for events
         */
        startListener(): void {
                const worker = new Worker('events', async (job) => {
                        const { name, data } = job;

                        const handlers = this.listeners[name] || [];

                        if (handlers.length === 0) {
                                logger.warn(`No handlers found for event: ${name}`);
                                return;
                        }

                        try {
                                await Promise.all(handlers.map((handler) => handler(data)));
                                logger.info(`Event processed successfully: ${name}`);
                        } catch (error) {
                                logger.error(`Error processing event ${name}:`, error);
                                throw error; // Bull will retry based on job configuration
                        }
                });

                worker.on('error', (error) => {
                        logger.error('Worker error:', error);
                });

                worker.on('failed', (job, err) => {
                        logger.error(`Job ${job?.id} failed:`, err);
                });

                logger.info('Bull Event Bus listener started');
        }
}

export const bullEventBus = new BullEventBus();
