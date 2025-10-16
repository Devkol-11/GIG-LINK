import { IEmailService } from "../interfaces/IEmailService";
import { logger } from "@core/logging/winston";

// IMPORT IMPLEMENTATION
import { emailTransporter } from "../email/EmailTransporter";
export class SendPasswordResetEmailUseCase {
  constructor(private emailService: IEmailService) {}

  async Execute(email: string, resetLink: string) {
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

export const sendPasswordResetEmailUseCase = new SendPasswordResetEmailUseCase(
  emailTransporter
);
