import { IEventBus } from "../domain/interfaces/EventbBus.js";
import { rabbitMQService } from "@core/message-brokers/RabbitMQ.js";

export class RabbitMQEventPublisher implements IEventBus {
  private exchange: string;
  constructor() {
    this.exchange = "auth.exchange";
  }

  async publish(routing_key: string, message: object) {
    await rabbitMQService.connect();
    await rabbitMQService.publish(this.exchange, routing_key, message);
  }
}

export const rabbitMQEventPublisher = new RabbitMQEventPublisher();
