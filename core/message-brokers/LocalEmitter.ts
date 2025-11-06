import { EventEmitter } from "events";
import { IEventBus } from "./IEventBus.js";

export class NodeEmitter implements IEventBus {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public publish(event: string, payload?: any): void {
    this.emitter.emit(event, payload);
  }

  public consume(event: string, callback: (payload: any) => void): void {
    this.emitter.on(event, callback);
  }
}

export const localEmitterGB = new NodeEmitter();
