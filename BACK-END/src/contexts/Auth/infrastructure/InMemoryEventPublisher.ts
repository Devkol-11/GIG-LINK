import { IEventPublisher } from "../domain/interfaces/EventPublisher";

export class InMemoryEventPublisher implements IEventPublisher {
  public published: Array<{ eventName: string; payload: any }> = [];

  async publish(eventName: string, payload: any): Promise<void> {
    this.published.push({ eventName, payload });
  }
}
