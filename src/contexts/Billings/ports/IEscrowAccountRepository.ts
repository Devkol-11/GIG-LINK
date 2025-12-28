import { Prisma } from 'prisma/generated/prisma/client.js';
import { EscrowAccount } from '../domain/entities/Escrow.js';
export interface IEscrowAccountRepository {
        save(escorwAccount: EscrowAccount, trx?: Prisma.TransactionClient): Promise<EscrowAccount>;
        findByid(escrowAccountId: string): Promise<EscrowAccount | null>;
}
