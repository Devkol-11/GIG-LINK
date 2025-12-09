import { logger } from '@src/infrastructure/logging/winston.js';
import { domainEventBus } from '../../../adapters/DomainEventBus-impl.js';
import { nodeMailerTransport } from '@src/infrastructure/email/nodeMailer.js';

export function passwordResetHandler() {
        domainEventBus.consume('password:reset', async (payload) => {
                if (payload) {
                        logger.info(`reset payload received : ${payload.otp}`);
                }

                await nodeMailerTransport.sendEmail(
                        payload.email,
                        `otp : ${payload.otp}`,
                        `password reset : ${payload.otp}`
                );

                logger.info('reset otp sent');
        });
}
