"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisteredConsumer = void 0;
const RabbitMQ_1 = require("@core/message-broker/RabbitMQ");
const winston_1 = require("@core/logging/winston");
// IMPORT IMPLEMENTATION
const SendWelcomeEmailUseCase_1 = require("../useCases/SendWelcomeEmailUseCase");
class UserRegisteredConsumer {
    constructor(sendWelcomeEmailUseCase) {
        this.sendWelcomeEmailUseCase = sendWelcomeEmailUseCase;
        this.exchange = "auth.exchange";
        this.routingKey = "auth.registered";
        this.queueName = "notification.user.registered";
    }
    async consume() {
        await RabbitMQ_1.rabbitMQService.consume(this.exchange, this.routingKey, this.queueName, async (payload) => {
            winston_1.logger.info("📨 Received user.registered event:", payload);
            const { email, firstName } = payload;
            await this.sendWelcomeEmailUseCase.execute(email, firstName);
        });
    }
}
exports.UserRegisteredConsumer = UserRegisteredConsumer;
const userRegisteredConsumer = new UserRegisteredConsumer(SendWelcomeEmailUseCase_1.sendWelcomeEmailUseCase);
userRegisteredConsumer.consume();
