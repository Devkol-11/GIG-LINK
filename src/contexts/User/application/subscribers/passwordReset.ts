import { logger } from '@core/Winston/winston.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';
import { nodeMailerTransport } from '@core/NodeMailer/nodeMailer.js';
import { html_templates } from '@src/shared/html_templates/templates.js';

interface payload {
        email: string;
        otp: string;
}

export function password_reset_handler() {
        domainEventBus.subscribe('password:reset', async (payload: payload) => {
                const { email, otp } = payload;

                const mail = html_templates.generateOtpEmail(otp);

                await nodeMailerTransport.sendEmail(email, mail.subject, mail.body);

                logger.info('reset otp sent');
        });
}
