// core/messaging/rabbitmq.service.ts
import amqp from "amqplib";
import { logger } from "@core/logging/winston";

export class RabbitMQService {
  private static instance: RabbitMQService;
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  private constructor() {}

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  public async connect(
    rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672"
  ): Promise<void> {
    if (this.connection && this.channel) return;

    this.connection = await amqp.connect(rabbitUrl);
    this.channel = await this.connection.createChannel();

    this.connection.on("error", (e) => {
      logger.warn("RabbitMQ connection error", e);
    });
    this.connection.on("close", () => {
      logger.warn("RabbitMQ connection closed");
    });

    logger.info(" RabbitMQ connected");
  }

  public async getChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      if (!this.connection) await this.connect();
      this.channel = await this.connection.createChannel();
    }
    return this.channel;
  }

  public async publish(
    exchange: string,
    routingKey: string,
    message: any
  ): Promise<void> {
    const ch = await this.getChannel();
    await ch.assertExchange(exchange, "direct", { durable: true });
    ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  public async consume(
    exchange: string,
    routingKey: string,
    queueName: string,
    onMessage: (msg: any) => Promise<void>
  ): Promise<void> {
    const ch = await this.getChannel();
    await ch.assertExchange(exchange, "direct", { durable: true });
    const q = await ch.assertQueue(queueName, { durable: true });
    await ch.bindQueue(q.queue, exchange, routingKey);

    ch.prefetch(1);
    ch.consume(q.queue, async (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        await onMessage(payload);
        ch.ack(msg);
      } catch (err) {
        console.error("consumer error:", err);
        ch.nack(msg, false, true);
      }
    });

    logger.info(
      `consuming queue="${q.queue}" bound to exchange="${exchange}" key="${routingKey}"`
    );
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      logger.info("RabbitMQ closed");
    } catch (err) {
      logger.warn("Error closing RabbitMQ:", err);
    }
  }
}

export const rabbitMQService = RabbitMQService.getInstance();
