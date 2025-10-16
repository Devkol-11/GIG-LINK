"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMQService = exports.RabbitMQService = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const winston_1 = require("@core/logging/winston");
class RabbitMQService {
    constructor() { }
    static getInstance() {
        if (!RabbitMQService.instance) {
            RabbitMQService.instance = new RabbitMQService();
        }
        return RabbitMQService.instance;
    }
    async connect(rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672") {
        if (this.connection && this.channel)
            return;
        this.connection = await amqplib_1.default.connect(rabbitUrl);
        this.channel = await this.connection.createChannel();
        this.connection.on("error", (e) => {
            winston_1.logger.warn("RabbitMQ connection error", e);
        });
        this.connection.on("close", () => {
            winston_1.logger.warn("RabbitMQ connection closed");
        });
        winston_1.logger.info(" RabbitMQ connected");
    }
    async getChannel() {
        if (!this.channel) {
            if (!this.connection)
                await this.connect();
            this.channel = await this.connection.createChannel();
        }
        return this.channel;
    }
    async publish(exchange, routingKey, message) {
        const ch = await this.getChannel();
        await ch.assertExchange(exchange, "direct", { durable: true });
        ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
    async consume(exchange, routingKey, queueName, onMessage) {
        const ch = await this.getChannel();
        await ch.assertExchange(exchange, "direct", { durable: true });
        const q = await ch.assertQueue(queueName, { durable: true });
        await ch.bindQueue(q.queue, exchange, routingKey);
        ch.prefetch(1);
        ch.consume(q.queue, async (msg) => {
            if (!msg)
                return;
            try {
                const payload = JSON.parse(msg.content.toString());
                await onMessage(payload);
                ch.ack(msg);
            }
            catch (err) {
                winston_1.logger.warn("consumer error:", err);
                ch.nack(msg, false, true);
            }
        });
        winston_1.logger.info(`consuming queue="${q.queue}" bound to exchange="${exchange}" key="${routingKey}"`);
    }
    async close() {
        try {
            if (this.channel)
                await this.channel.close();
            if (this.connection)
                await this.connection.close();
            winston_1.logger.info("RabbitMQ closed");
        }
        catch (err) {
            winston_1.logger.warn("Error closing RabbitMQ:", err);
        }
    }
}
exports.RabbitMQService = RabbitMQService;
exports.rabbitMQService = RabbitMQService.getInstance();
