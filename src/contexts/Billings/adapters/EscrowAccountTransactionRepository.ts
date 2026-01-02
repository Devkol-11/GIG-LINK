import { IEscrowAccountTransactionRepository } from '../ports/IEscrowAccountTransaction.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { EscrowAccountTransaction } from '../domain/entities/EscrowTransaction.js';

export class EscrowAccountTransactionRepository implements IEscrowAccountTransactionRepository {
        async save(
                escrowAccountTransaction: EscrowAccountTransaction,
                trx?: Prisma.TransactionClient
        ): Promise<EscrowAccountTransaction> {
                const client = trx ?? prismaDbClient;

                const data = escrowAccountTransaction.getState();

                const record = await client.escrowTransaction.create({ data });
                return EscrowAccountTransaction.toEntity(record);
        }

        async findById(id: string): Promise<EscrowAccountTransaction | null> {
                const record = await prismaDbClient.escrowTransaction.findUnique({ where: { id } });
                if (!record) return null;
                return EscrowAccountTransaction.toEntity(record);
        }
}

export const escrowAccountTransactionRepository = new EscrowAccountTransactionRepository();
