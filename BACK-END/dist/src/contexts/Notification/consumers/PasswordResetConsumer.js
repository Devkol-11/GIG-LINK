"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetConsumer = void 0;
const RabbitMQ_1 = require("@core/message-broker/RabbitMQ");
const winston_1 = require("@core/logging/winston");
// IMPORT IMPLEMENTATION
const sendPasswordResetEmailUseCase_1 = require("../useCases/sendPasswordResetEmailUseCase");
class PasswordResetConsumer {
    constructor(sendPasswordResetEmailUseCase) {
        this.sendPasswordResetEmailUseCase = sendPasswordResetEmailUseCase;
        this.exchange = "auth.exchange";
        this.routingKey = "auth.registered";
        this.queueName = "notification.user.registered";
    }
    async consume() {
        await RabbitMQ_1.rabbitMQService.consume(this.exchange, this.routingKey, this.queueName, async (payload) => {
            winston_1.logger.info("📨 Received user.registered event:", payload);
            const { email, firstName } = payload;
            await this.sendPasswordResetEmailUseCase.Execute(email, firstName);
        });
    }
}
exports.PasswordResetConsumer = PasswordResetConsumer;
const passwordResetConsumer = new PasswordResetConsumer(sendPasswordResetEmailUseCase_1.sendPasswordResetEmailUseCase);
passwordResetConsumer.consume();
