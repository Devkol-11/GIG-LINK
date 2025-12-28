import { IPayoutAccountRepository } from '../ports/IPayoutAccountRepository.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { PayoutAccount } from '../domain/entities/PayoutAccount.js';

export class PayoutAccountRepository implements IPayoutAccountRepository {
        async save(payoutAccount: PayoutAccount, trx?: Prisma.TransactionClient): Promise<PayoutAccount> {
                const client = trx ? trx : prismaDbClient;

                const data = payoutAccount.getState();

                const record = await client.paymentRecipient.create({ data });

                return PayoutAccount.toEntity(record);
        }

        async findByUserId(userId: string, trx?: Prisma.TransactionClient): Promise<PayoutAccount | null> {
                const client = trx ? trx : prismaDbClient;

                const record = await client.paymentRecipient.findUnique({ where: { userId } });

                if (!record) return null;

                return PayoutAccount.toEntity(record);
        }
}

export const payoutAccountRepository = new PayoutAccountRepository();
