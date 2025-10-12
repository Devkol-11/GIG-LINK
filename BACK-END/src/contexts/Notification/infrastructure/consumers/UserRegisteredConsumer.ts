import { rabbitMQService } from "@core/message-broker/RabbitMQ";
import { SendWelcomeEmailUseCase } from "../../useCases/SendWelcomeEmailUseCase";
import { IEventConsumer } from "../../domain/interfaces/IEventConsumer";
import { logger } from "@core/logging/winston";

// IMPORT IMPLEMENTATION
import { sendWelcomeEmailUseCase } from "../../useCases/SendWelcomeEmailUseCase";

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
