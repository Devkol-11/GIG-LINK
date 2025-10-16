import { IEventBus } from "../domain/interfaces/EventbBus";
import { rabbitMQService } from "@core/message-broker/RabbitMQ";

export class RabbitMQEventPublisher implements IEventBus {
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
