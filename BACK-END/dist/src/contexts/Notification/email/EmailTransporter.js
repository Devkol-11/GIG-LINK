"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransporter = exports.EmailService = void 0;
require("module-alias/register");
const nodemailer_1 = __importDefault(require("nodemailer"));
const winston_1 = require("@core/logging/winston");
const env_1 = require("@core/config/env");
class EmailService {
    constructor() {
        this.transportOptions = {
            host: env_1.config.MAIL_HOST,
            port: Number(env_1.config.MAIL_PORT),
            auth: {
                user: env_1.config.MAIL_USERNAME,
                pass: env_1.config.MAIL_PASSWORD,
            },
        };
        this.transporter = nodemailer_1.default.createTransport(this.transportOptions);
    }
    async sendEmail(email, subject, body) {
        const mailOptions = {
            from: env_1.config.MAIL_FROM || "no-reply@giglink.app",
            to: email,
            subject,
            body,
        };
        const info = await this.transporter.sendMail(mailOptions);
        winston_1.logger.info(`Email sent : ${info.messageId}`);
    }
}
exports.EmailService = EmailService;
exports.emailTransporter = new EmailService();
