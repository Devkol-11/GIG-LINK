import { rabbitMQService } from "@core/message-brokers/RabbitMQ.js";
import { SendPasswordResetEmailUseCase } from "../useCases/sendPasswordResetEmailUseCase.js";
import { IEventConsumer } from "../interfaces/IEventConsumer.js";
import { logger } from "@core/logging/winston.js";

// IMPORT IMPLEMENTATION
import { sendPasswordResetEmailUseCase } from "../useCases/sendPasswordResetEmailUseCase.js";

export class PasswordResetConsumer implements IEventConsumer {
  private readonly exchange = "auth.exchange";
  private readonly routingKey = "auth.registered";
  private readonly queueName = "notification.user.registered";
  constructor(
    private sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase
  ) {}

  public async consume(): Promise<void> {
    await rabbitMQService.consume(
      this.exchange,
      this.routingKey,
      this.queueName,
      async (payload) => {
        logger.info("📨 Received user.registered event:", payload);
        const { email, firstName } = payload;
        await this.sendPasswordResetEmailUseCase.Execute(email, firstName);
      }
    );
  }
}

const passwordResetConsumer = new PasswordResetConsumer(
  sendPasswordResetEmailUseCase
);

passwordResetConsumer.consume();
