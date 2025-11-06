"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMQEventPublisher = exports.RabbitMQEventPublisher = void 0;
const RabbitMQ_1 = require("@core/message-broker/RabbitMQ");
class RabbitMQEventPublisher {
    constructor() {
        this.exchange = "auth.exchange";
    }
    async publish(eventname, message) {
        await RabbitMQ_1.rabbitMQService.connect();
        await RabbitMQ_1.rabbitMQService.publish(this.exchange, eventname, message);
    }
}
exports.RabbitMQEventPublisher = RabbitMQEventPublisher;
exports.rabbitMQEventPublisher = new RabbitMQEventPublisher();
