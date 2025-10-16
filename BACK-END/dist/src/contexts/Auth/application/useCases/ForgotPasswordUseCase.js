"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordUseCase = exports.ForgotPasswordUseCase = void 0;
const DomainException_1 = require("../../domain/exceptions/DomainException");
const PasswordResetEvent_1 = require("../../domain/events/PasswordResetEvent");
//IMPORT IMPLEMENTATIONS
const AuthRepository_1 = require("../../infrastructure/AuthRepository");
const passwordResetTokenRepository_1 = require("../../infrastructure/passwordResetTokenRepository");
const RabbitMQService_1 = require("../../infrastructure/RabbitMQService");
class ForgotPasswordUseCase {
    constructor(authRepository, passwordResetTokenRepository, eventPublisher) {
        this.authRepository = authRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.eventPublisher = eventPublisher;
    }
    async Execute(DTO) {
        const { email } = DTO;
        const userData = await this.authRepository.findByEmail(email);
        if (!userData) {
            throw new DomainException_1.DomainException("user not found", 404);
        }
        const tokenData = await this.passwordResetTokenRepository.create(userData.id);
        const tokenEvent = new PasswordResetEvent_1.PasswordResetEvent(tokenData.id, tokenData.userId, tokenData.token);
        await this.eventPublisher.publish(tokenEvent.routing_key, tokenEvent);
        return {
            message: "OTP sent , please check your mail",
        };
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
exports.forgotPasswordUseCase = new ForgotPasswordUseCase(AuthRepository_1.authRepository, passwordResetTokenRepository_1.passwordResetTokenRepository, RabbitMQService_1.rabbitMQEventPublisher);
