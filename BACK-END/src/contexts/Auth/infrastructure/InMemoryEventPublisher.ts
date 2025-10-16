import { IEventBus } from "../domain/interfaces/EventbBus";

export class InMemoryEventPublisher implements IEventBus {
  public published: Array<{ eventName: string; payload: any }> = [];

  async publish(eventName: string, payload: any): Promise<void> {
    this.published.push({ eventName, payload });
  }
}
