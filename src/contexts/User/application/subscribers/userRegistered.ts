import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';
import { nodeMailerTransport } from '@core/NodeMailer/nodeMailer.js';
import { html_templates } from '@src/shared/html_templates/templates.js';

export interface payload {
        email: string;
        firstName: string;
        role: string;
}

export function user_registered_handler() {
        domainEventBus.subscribe('user:registered', async (payload: payload) => {
                const { email, firstName, role } = payload;

                const mail = html_templates.generateWelcomeEmail(firstName, role);

                await nodeMailerTransport.sendEmail(email, mail.subject, mail.body);

                console.log('registration email sent');
        });
}
