import "module-alias/register";
import { logger } from "@core/logging/winston.js";
import { rabbitMQService } from "@core/message-brokers/RabbitMQ.js";

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
    await rabbitMQService.connect();
    for (const e of events) {
      logger.info(`Publishing: ${JSON.stringify(e.payload)}`);
      await rabbitMQService.publish(e.exchange, e.routing_key, e.payload);
    }
  } catch (error) {
    logger.warn(error);
  }
};

// Consumer
const consumeTest = async () => {
  try {
    await rabbitMQService.connect();
    await rabbitMQService.consume(
      "app_exchange",
      "User",
      "array_test_queue",
      async (msg) => {
        logger.info("📩 Event received:", msg);
        logger.info(`Simulating email sending to: ${msg.email}...`);
      }
    );
  } catch (error) {
    logger.warn(error);
  }
};

export { publishTest, consumeTest };
