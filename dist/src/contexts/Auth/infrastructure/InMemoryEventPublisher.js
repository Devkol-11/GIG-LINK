'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.InMemoryEventPublisher = void 0;
class InMemoryEventPublisher {
        constructor() {
                this.published = [];
        }
        async publish(eventName, payload) {
                this.published.push({ eventName, payload });
        }
}
exports.InMemoryEventPublisher = InMemoryEventPublisher;
