import { EventEmitter } from 'events';

export class NodeEmitter {
        private emitter: EventEmitter;

        constructor() {
                this.emitter = new EventEmitter();
        }

        public publish(event: string, payload?: any): Promise<void> {
                this.emitter.emit(event, payload);
                return Promise.resolve();
        }

        public consume(
                event: string,
                callback: (payload: any) => Promise<void>
        ): Promise<void> {
                this.emitter.on(event, callback);

                return Promise.resolve();
        }
}

export const nodeEmitter = new NodeEmitter();
