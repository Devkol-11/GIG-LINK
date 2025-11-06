import { rabbitMQService } from "@core/message-brokers/RabbitMQ.js";
import { SendWelcomeEmailUseCase } from "../useCases/SendWelcomeEmailUseCase.js";
import { IEventConsumer } from "../interfaces/IEventConsumer.js";
import { logger } from "@core/logging/winston.js";

// IMPORT IMPLEMENTATION
import { sendWelcomeEmailUseCase } from "../useCases/SendWelcomeEmailUseCase.js";

export class UserRegisteredConsumer implements IEventConsumer {
  private readonly exchange = "auth.exchange";
  private readonly routingKey = "auth.registered";
  private readonly queueName = "notification.user.registered";

  constructor(
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase
  ) {}

  public async consume(): Promise<void> {
    await rabbitMQService.consume(
      this.exchange,
      this.routingKey,
      this.queueName,
      async (payload) => {
        logger.info("📨 Received user.registered event:", payload);
        const { email, firstName } = payload;
        await this.sendWelcomeEmailUseCase.execute(email, firstName);
      }
    );
  }
}

const userRegisteredConsumer = new UserRegisteredConsumer(
  sendWelcomeEmailUseCase
);

userRegisteredConsumer.consume();
