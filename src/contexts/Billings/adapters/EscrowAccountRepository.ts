import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { IEscrowAccountRepository } from '../ports/IEscrowAccountRepository.js';
import { EscrowAccount } from '../domain/entities/Escrow.js';

export class EscrowAccountRepository implements IEscrowAccountRepository {
        async save(escorwAccount: EscrowAccount, trx?: Prisma.TransactionClient): Promise<EscrowAccount> {
                const data = escorwAccount.getState();

                const client = trx ?? prismaDbClient;

                const record = await client.escrowAccount.create({ data });

                return EscrowAccount.toEntity(record);
        }

        async findByid(escrowAccountId: string): Promise<EscrowAccount | null> {
                const record = await prismaDbClient.escrowAccount.findUnique({
                        where: { id: escrowAccountId }
                });

                return record ? EscrowAccount.toEntity(record) : null;
        }
}

export const escrowAccountRepository = new EscrowAccountRepository();
