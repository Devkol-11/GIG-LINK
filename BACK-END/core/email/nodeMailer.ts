import "module-alias/register";
import nodemailer from "nodemailer";
import { logger } from "@core/logging/winston.js";
import { config } from "@core/config/env.js";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class NodeMailer {
  private static instance: NodeMailer;
  private transporter;
  private transportOptions: SMTPTransport.Options;

  private constructor() {
    NodeMailer.instance = new NodeMailer();

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

  public static getInstance(): NodeMailer {
    if (!NodeMailer.instance) {
      NodeMailer.instance = new NodeMailer();
    }
    return NodeMailer.instance;
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

export const nodeMailerTransport = NodeMailer.getInstance();
