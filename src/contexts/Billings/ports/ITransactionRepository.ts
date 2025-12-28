import { Prisma } from 'prisma/generated/prisma/client.js';
import { Transaction } from '../domain/entities/Transactions.js';
import { TransactionStatusType } from '../domain/enums/DomainEnums.js';

export interface ITransactionRepository {
        // findAllByWallet(walletId: string): Promise<Transaction[]>;

        findById(id: string, trx?: Prisma.TransactionClient): Promise<Transaction | null>;

        findByWalletId(walletId: string, trx?: Prisma.TransactionClient): Promise<Transaction[]>;

        findByPaymentId(paymentId: string, trx?: Prisma.TransactionClient): Promise<Transaction[]>;

        findByReference(reference: string, trx?: Prisma.TransactionClient): Promise<Transaction | null>;

        save(transaction: Transaction, trx?: Prisma.TransactionClient): Promise<Transaction>;

        updateStatus(transactionId: string, status: TransactionStatusType): Promise<void>;

        findSuccessInDateRange(
                startDate: Date,
                endDate: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction[]>;

        findByTypeAndDateRange(
                type: string,
                startDate: Date,
                endDate: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction[]>;
}
