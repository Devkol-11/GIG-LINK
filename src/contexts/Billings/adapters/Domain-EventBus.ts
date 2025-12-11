import { IEventBus } from '../ports/IEventBus.js';
import { nodeEmitter } from '@src/infrastructure/message-brokers/adapters/NodeEmitter-impl.js';

export class DomainEventBus implements IEventBus {
        publish(event: string, payload: any): Promise<void> {
                return nodeEmitter.publish(event, payload);
        }

        consume(event: string, callback: (payload: any) => Promise<void>): Promise<void> {
                return nodeEmitter.consume(event, callback);
        }
}

export const domainEventBus = new DomainEventBus();
