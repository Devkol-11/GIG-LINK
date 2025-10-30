import { IEmailService } from "../interfaces/IEmailService.js";

// IMPORT IMPLEMENTATION
import { emailTransporter } from "../email/EmailTransporter.js";

export class SendWelcomeEmailUseCase {
  constructor(private readonly emailService: IEmailService) {}

  async execute(email: string, firstName: string): Promise<void> {
    const subject = "Welcome to GIG-Link 🎉";
    const body = `
      <h1>Hi ${firstName},</h1>
      <p>Welcome aboard! We're excited to have you.</p>
    `;
    await this.emailService.sendEmail(email, subject, body);
  }
}

export const sendWelcomeEmailUseCase = new SendWelcomeEmailUseCase(
  emailTransporter
);
