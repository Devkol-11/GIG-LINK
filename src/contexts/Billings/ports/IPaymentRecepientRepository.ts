import { PaymentRecipient } from 'prisma/generated/prisma/client.js';

export interface IPaymentRecepientRepository {
        save(code: string): Promise<PaymentRecipient>;
}
