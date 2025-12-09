'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendWelcomeEmailUseCase = exports.SendWelcomeEmailUseCase = void 0;
// IMPORT IMPLEMENTATION
const EmailTransporter_1 = require('../email/EmailTransporter');
class SendWelcomeEmailUseCase {
        constructor(emailService) {
                this.emailService = emailService;
        }
        async execute(email, firstName) {
                const subject = 'Welcome to GIG-Link 🎉';
                const body = `
      <h1>Hi ${firstName},</h1>
      <p>Welcome aboard! We're excited to have you.</p>
    `;
                await this.emailService.sendEmail(email, subject, body);
        }
}
exports.SendWelcomeEmailUseCase = SendWelcomeEmailUseCase;
exports.sendWelcomeEmailUseCase = new SendWelcomeEmailUseCase(
        EmailTransporter_1.emailTransporter
);
