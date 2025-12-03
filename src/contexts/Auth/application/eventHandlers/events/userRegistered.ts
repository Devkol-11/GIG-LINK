import { domainEventBus } from '../../../adapters/DomainEventBus-impl.js';
import { nodeMailerTransport } from '@src/infrastructure/email/nodeMailer.js';

export function userRegisteredHandler() {
        domainEventBus.consume('user:registered', async (payload) => {
                if (payload) {
                        console.log('received payload', payload);
                }

                await nodeMailerTransport.sendEmail(
                        payload.email,
                        'Welcome to GigLink!',
                        `Hello ${payload.firstName}, welcome to the platform!`
                );

                console.log('registration email sent');
        });
}
