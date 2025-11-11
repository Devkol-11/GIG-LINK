import type { IEventBus } from "./ports/IEventBus.js";
import type { IEventHandler } from "../message-brokers/ports/IEventHandler.js";

export class EventBusManager {
  private handlersMap: Record<string, IEventHandler[]> = {}; // map eventName -> list of handler instances

  constructor(private readonly bus: IEventBus) {}

  // Register a handler instance for an event name
  public register(eventName: string, handler: IEventHandler): void {
    // If first time registering this eventName, set up the adapter to notify us
    if (!this.handlersMap[eventName]) {
      this.handlersMap[eventName] = [];

      // Ask the underlying bus to call this callback when the transport receives an event
      // NOTE: the bus (adapter) will call this callback whenever a message arrives
      this.bus.consume(eventName, async (payload: any) => {
        // When a payload arrives, forward it to every registered handler
        const handlers = this.handlersMap[eventName] || [];
        for (const h of handlers) {
          try {
            await h.handle(payload); // invoke the handler (domain logic)
          } catch (err) {
            // swallow/log - a failing handler should not break other handlers
            console.error(`Handler for ${eventName} failed:`, err);
          }
        }
      });
    }

    // Add handler to the list so future incoming messages call it
    this.handlersMap[eventName].push(handler);
  }

  // Publish is simple: delegate to the adapter
  public async publish(eventName: string, payload: any): Promise<void> {
    await this.bus.publish(eventName, payload);
  }
}
