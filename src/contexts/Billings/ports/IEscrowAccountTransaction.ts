import { EscrowAccountTransaction } from '../domain/entities/EscrowTransaction.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

export interface IEscrowAccountTransactionRepository {
        save(
                escrowAccountTransaction: EscrowAccountTransaction,
                trx?: Prisma.TransactionClient
        ): Promise<EscrowAccountTransaction>;
        findById(id: string): Promise<EscrowAccountTransaction | null>;
}
