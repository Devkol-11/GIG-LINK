import { IEventPublisher } from "../domain/interfaces/EventPublisher";
import { rabbitMQService } from "@core/message-broker/RabbitMQ";

export class RabbitMQEventPublisher implements IEventPublisher {
  private exchange: string;
  constructor() {
    this.exchange = "auth.exchange";
  }

  async publish(eventname: string, message: object) {
    await rabbitMQService.connect();
    await rabbitMQService.publish(this.exchange, eventname, message);
  }
}

export const rabbitMQEventPublisher = new RabbitMQEventPublisher();
