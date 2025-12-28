import 'module-alias/register';
import { logger } from '@core/Winston/winston.js';
import { config } from '@src/infrastructure/EnvConfig/env.js';
import { createTransport } from 'nodemailer';

export class NodeMailer {
        private static instance: NodeMailer | null = null;
        private transporter: any;
        private transportOptions: any;

        private constructor() {}

        private createTransporter() {
                this.transportOptions = {
                        host: config.MAIL_HOST,
                        port: Number(config.MAIL_PORT),
                        auth: {
                                user: config.MAIL_USERNAME,
                                pass: config.MAIL_PASSWORD
                        }
                };

                this.transporter = createTransport(this.transportOptions);
        }

        public static getInstance(): NodeMailer {
                if (!NodeMailer.instance) {
                        NodeMailer.instance = new NodeMailer();
                }
                return NodeMailer.instance;
        }

        async sendEmail(email: string, subject: string, body: string): Promise<void> {
                const mailOptions = {
                        from: config.MAIL_FROM || 'no-reply@giglink.app',
                        to: email,
                        subject,
                        body
                };

                this.createTransporter();

                const info = await this.transporter.sendMail(mailOptions);

                logger.info(`Email sent : ${info.messageId}`);
        }
}

export const nodeMailerTransport = NodeMailer.getInstance();
