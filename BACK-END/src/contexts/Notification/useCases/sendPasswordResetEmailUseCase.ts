import { IEmailService } from "../domain/interfaces/IEmailService";
import { IRabbitMQService } from "../domain/interfaces/IEventConsumer";
import { logger } from "@core/logging/winston";

export class SendWelcomeEmailUseCase {
  constructor(
    private emailService: IEmailService,
    private rabbitMQService: IRabbitMQService
  ) {}

  async Execute() {}
}
