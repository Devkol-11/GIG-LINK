"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordUseCase = exports.ResetPasswordUseCase = void 0;
const DomainException_1 = require("../../domain/exceptions/DomainException");
//IMPORT IMPLEMENTATIONS
const AuthService_1 = require("../../domain/services/AuthService");
const AuthRepository_1 = require("../../infrastructure/AuthRepository");
const passwordResetTokenRepository_1 = require("../../infrastructure/passwordResetTokenRepository");
class ResetPasswordUseCase {
    constructor(authService, authRepository, passwordResetTokenRepository) {
        this.authService = authService;
        this.authRepository = authRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }
    async Execute(token, newPassword) {
        const tokenData = await this.passwordResetTokenRepository.findByToken(token);
        if (!tokenData) {
            throw new DomainException_1.DomainException("Invalid token", 404);
        }
        if (tokenData.used) {
            throw new DomainException_1.DomainException("Token already used", 400);
        }
        if (tokenData.isExpired()) {
            throw new DomainException_1.DomainException("Token has expired", 400);
        }
        const hashed = await this.authService.hashPassword(newPassword);
        await this.authRepository.updatePassword(tokenData.userId, hashed);
        await this.passwordResetTokenRepository.markAsUsed(token);
        await this.passwordResetTokenRepository.deleteAllForUser(tokenData.userId);
        return { message: "Password reset successful" };
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
exports.resetPasswordUseCase = new ResetPasswordUseCase(AuthService_1.authservice, AuthRepository_1.authRepository, passwordResetTokenRepository_1.passwordResetTokenRepository);
