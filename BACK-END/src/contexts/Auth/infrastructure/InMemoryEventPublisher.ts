import { IEventBus } from "../domain/interfaces/EventbBus.js";
import { localEmitter } from "@core/message-brokers/LocalEmitter.js";

export class InMemoryEventPublisher implements IEventBus {
  async publish(eventName: string, payload: any): Promise<void> {
    localEmitter.publish(eventName, payload);
  }
}
