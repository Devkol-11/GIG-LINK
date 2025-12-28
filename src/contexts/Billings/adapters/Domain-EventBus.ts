import { IEventBus } from '../ports/IEventBus.js';
import { bullEventBus } from '@core/BullMQ/BullEventBus.js';

export class DomainEventBus implements IEventBus {
        publish(event: string, payload: any): void {
                bullEventBus.publish(event, payload);
        }

        subscribe(event: string, callback: (payload: any) => Promise<void>): void {
                bullEventBus.subscribe(event, callback);
        }
}

export const domainEventBus = new DomainEventBus();
