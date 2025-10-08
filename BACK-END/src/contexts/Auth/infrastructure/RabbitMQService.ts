import { string } from "joi";
import { IEventPublisher } from "../domain/interfaces/EventPublisher";
import { rabbitMQService } from "@core/message-broker/RabbitMQ";

export class RabbitMQEventPublisher implements IEventPublisher {
  private exchange: string;
  constructor(exchange = "app_exchange") {
    this.exchange = exchange;
  }

  async publish(eventname: string, payload: object) {
    await rabbitMQService.connect();
    await rabbitMQService.publish(this.exchange, eventname, payload);
  }
}

export const rabbitMQEventPublisher = new RabbitMQEventPublisher();
