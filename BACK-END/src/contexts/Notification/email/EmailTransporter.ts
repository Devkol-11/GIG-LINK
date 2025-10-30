import "module-alias/register";
import nodemailer from "nodemailer";
import { logger } from "@core/logging/winston.js";
import { IEmailService } from "../interfaces/IEmailService.js";
import { config } from "@core/config/env.js";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class EmailService implements IEmailService {
  private transporter;
  private transportOptions: SMTPTransport.Options;

  constructor() {
    this.transportOptions = {
      host: config.MAIL_HOST,
      port: Number(config.MAIL_PORT),
      auth: {
        user: config.MAIL_USERNAME,
        pass: config.MAIL_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(this.transportOptions);
  }

  async sendEmail(email: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: config.MAIL_FROM || "no-reply@giglink.app",
      to: email,
      subject,
      body,
    };

    const info = await this.transporter.sendMail(mailOptions);
    logger.info(`Email sent : ${info.messageId}`);
  }
}

export const emailTransporter = new EmailService();
