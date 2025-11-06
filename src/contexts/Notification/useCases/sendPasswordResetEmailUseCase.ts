import { IEmailService } from "../interfaces/IEmailService.js";
import { logger } from "@core/logging/winston.js";

// IMPORT IMPLEMENTATION
import { emailTransporter } from "../email/EmailTransporter.js";
export class SendPasswordResetEmailUseCase {
  constructor(private emailService: IEmailService) {}

  async Execute(email: string, resetOTP: string) {
    const subject = "Token to reset your password";
    const body = `
        <h3>Password Reset</h3>
        <p>Use the Code below to reset your password:</p>
        <a href="${resetOTP}">${resetOTP}</a>
        <p>This code will expire in 10 minutes.</p>
      `;

    await this.emailService.sendEmail(email, subject, body);
  }
}

export const sendPasswordResetEmailUseCase = new SendPasswordResetEmailUseCase(
  emailTransporter
);
