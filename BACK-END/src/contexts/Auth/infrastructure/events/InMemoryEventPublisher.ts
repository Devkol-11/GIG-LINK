import { EventPublisher } from "./EventPublisher";

export class inMemoryEventPublisher implements EventPublisher {
  private events: Array<{ type: string; payload: any }> = [];

  async publish(event: string, payload: any): Promise<void> {
    console.log(`${event} published , payload : `);
    this.events.push({ type: event, payload });
  }
  // Helper method for testing - not part of the interface
  getPublishedEvents(): Array<{ type: string; payload: any }> {
    return [...this.events];
  }
}
