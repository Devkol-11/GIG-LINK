import { Prisma } from 'prisma/generated/prisma/client.js';
import { PayoutAccount } from '../domain/entities/PayoutAccount.js';

export interface IPayoutAccountRepository {
        save(data: PayoutAccount, trx?: Prisma.TransactionClient): Promise<PayoutAccount>;
        findByUserId(userId: string, trx?: Prisma.TransactionClient): Promise<PayoutAccount | null>;
}
