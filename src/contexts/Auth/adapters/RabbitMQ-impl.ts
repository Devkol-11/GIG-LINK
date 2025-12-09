// import { IEventBus } from '../ports/EventBus.js';
// import { rabbitMQService } from '@src/infrastructure/message-brokers/adapters/RabbitMQ-impl.js';

// export class RabbitMQ implements IEventBus {
//         publish(event: string, payload: any): Promise<void> {
//                 return rabbitMQService.publish(event, payload);
//         }

//         consume(
//                 event: string,
//                 callback: (payload: any) => Promise<void>
//         ): Promise<void> {
//                 return rabbitMQService.consume(event, callback);
//         }
// }
