import { EventBusManager } from "./EventsBusManager.js";
import { NodeEmitter } from "./adapters/NodeEmitter-impl.js";
import { marketplaceHandlers } from "@src/contexts/Market-place/handlers/index.js";

export async function buildEventBus(injectAdapter: any) {
  // choose adapter (we use local emitter here; swap to RabbitMQ adapter for prod)
  const adapter = new injectAdapter();

  // create the manager that uses the adapter
  const manager = new EventBusManager(adapter);

  // register handlers (this tells manager which event -> which handler)
  for (const [eventName, handler] of Object.entries(marketplaceHandlers)) {
    manager.register(eventName, handler);
  }

  return manager;
}

// Export a ready-to-use EventBusManager
export const eventBus = await buildEventBus(new NodeEmitter());
