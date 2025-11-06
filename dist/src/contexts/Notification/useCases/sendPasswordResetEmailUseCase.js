"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmailUseCase = exports.SendPasswordResetEmailUseCase = void 0;
// IMPORT IMPLEMENTATION
const EmailTransporter_1 = require("../email/EmailTransporter");
class SendPasswordResetEmailUseCase {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async Execute(email, resetLink) {
        const subject = "Token to reset your password";
        const body = `
        <h3>Password Reset</h3>
        <p>We received a request to reset your password. Click the link below to set a new one:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `;
        await this.emailService.sendEmail(email, subject, body);
    }
}
exports.SendPasswordResetEmailUseCase = SendPasswordResetEmailUseCase;
exports.sendPasswordResetEmailUseCase = new SendPasswordResetEmailUseCase(EmailTransporter_1.emailTransporter);
