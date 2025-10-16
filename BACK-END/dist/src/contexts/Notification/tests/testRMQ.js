"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeTest = exports.publishTest = void 0;
require("module-alias/register");
const winston_1 = require("@core/logging/winston");
const RabbitMQ_1 = require("@core/message-broker/RabbitMQ");
const events = [
    {
        exchange: "app_exchange",
        routing_key: "User",
        payload: { id: 1, email: "kol@gmail.com" },
    },
    {
        exchange: "app_exchange",
        routing_key: "User",
        payload: { id: 2, email: "jol@gmail.com" },
    },
    {
        exchange: "app_exchange",
        routing_key: "User",
        payload: { id: 3, email: "lol@gmail.com" },
    },
];
// Publisher
const publishTest = async () => {
    try {
        await RabbitMQ_1.rabbitMQService.connect();
        for (const e of events) {
            winston_1.logger.info(`Publishing: ${JSON.stringify(e.payload)}`);
            await RabbitMQ_1.rabbitMQService.publish(e.exchange, e.routing_key, e.payload);
        }
    }
    catch (error) {
        winston_1.logger.warn(error);
    }
};
exports.publishTest = publishTest;
// Consumer
const consumeTest = async () => {
    try {
        await RabbitMQ_1.rabbitMQService.connect();
        await RabbitMQ_1.rabbitMQService.consume("app_exchange", "User", "array_test_queue", async (msg) => {
            winston_1.logger.info("📩 Event received:", msg);
            winston_1.logger.info(`Simulating email sending to: ${msg.email}...`);
        });
    }
    catch (error) {
        winston_1.logger.warn(error);
    }
};
exports.consumeTest = consumeTest;
