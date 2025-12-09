import { ITransactionRepository } from '../ports/ITransactionRepository.js';
import { Transaction } from '../domain/aggregate-roots/Transactions.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/database/prisma.client.js';
import { TransactionStatus, TransactionStatusType } from '../domain/enums/DomainEnums.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class TransactionRepository implements ITransactionRepository {
        constructor() {}

        //-----1: findById (single)
        async findById(id: string, trx?: Prisma.TransactionClient): Promise<Transaction | null> {
                const client = trx ? trx : prismaDbClient;

                const transactionData = await client.transaction.findUnique({
                        where: { id }
                });

                if (!transactionData) return null;

                return Transaction.toEntity({
                        ...transactionData,
                        metadata: transactionData.metadata ?? null
                });
        }

        //-----2: findByWalletId (bulk)
        async findByWalletId(
                walletId: string,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction[]> {
                const client = trx ? trx : prismaDbClient;

                const transactionsData = await client.transaction.findMany({
                        where: { walletId },
                        orderBy: { createdAt: 'desc' }
                });

                return transactionsData.map((transaction) =>
                        Transaction.toEntity({
                                ...transaction,
                                metadata: transaction.metadata ?? null
                        })
                );
        }

        //-----3: findByPaymentId (bulk)
        async findByPaymentId(
                paymentId: string,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction[]> {
                const client = trx ? trx : prismaDbClient;

                const transactionsData = await client.transaction.findMany({
                        where: { paymentId },
                        orderBy: { createdAt: 'desc' }
                });

                return transactionsData.map((transaction) =>
                        Transaction.toEntity({
                                ...transaction,
                                metadata: transaction.metadata ?? null
                        })
                );
        }

        //-----4: findByReference (single)
        async findByReference(
                providerReference: string,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction | null> {
                const client = trx ? trx : prismaDbClient;

                const transactionData = await client.transaction.findUnique({
                        where: { providerReference }
                });

                if (!transactionData) return null;

                return Transaction.toEntity({
                        ...transactionData,
                        metadata: transactionData.metadata ?? null
                });
        }

        //-----5: save (single)
        async save(transaction: Transaction, trx?: Prisma.TransactionClient): Promise<Transaction> {
                const client = trx ? trx : prismaDbClient;
                const state = transaction.getState();

                try {
                        const savedTransaction = await client.transaction.create({
                                data: {
                                        id: state.id,
                                        walletId: state.walletId,
                                        transactionType: state.transactionType,
                                        amountCents: state.amountCents,
                                        status: state.status,
                                        providerReference: state.providerReference,
                                        source: state.source,
                                        paymentId: state.paymentId,
                                        description: state.description,
                                        metadata:
                                                state.metadata === null
                                                        ? Prisma.JsonNull
                                                        : state.metadata,
                                        systemReference: state.systemReference,
                                        createdAt: state.createdAt,
                                        updatedAt: new Date()
                                }
                        });

                        return Transaction.toEntity({
                                ...savedTransaction,
                                metadata: savedTransaction.metadata ?? null
                        });
                } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                                if (error.code === 'P2002') {
                                        throw BusinessError.conflict(
                                                'Transaction with this reference already exists'
                                        );
                                }
                        }
                        throw error;
                }
        }

        //-----6: updateStatus (single)
        async updateStatus(
                transactionId: string,
                status: TransactionStatusType,
                trx?: Prisma.TransactionClient
        ): Promise<void> {
                const client = trx ? trx : prismaDbClient;

                try {
                        await client.transaction.update({
                                where: { id: transactionId },
                                data: {
                                        status,
                                        updatedAt: new Date()
                                }
                        });
                } catch (error) {
                        if (
                                error instanceof Prisma.PrismaClientKnownRequestError &&
                                error.code === 'P2025'
                        ) {
                                throw BusinessError.notFound('Transaction not found');
                        }
                        throw error;
                }
        }

        //-----7: findSuccessInDateRange (bulk)
        async findSuccessInDateRange(
                startDate: Date,
                endDate: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction[]> {
                const client = trx ? trx : prismaDbClient;

                const transactionsData = await client.transaction.findMany({
                        where: {
                                status: TransactionStatus.SUCCESS,
                                createdAt: {
                                        gte: startDate,
                                        lte: endDate
                                }
                        },
                        orderBy: { createdAt: 'desc' }
                });

                return transactionsData.map((transaction) =>
                        Transaction.toEntity({
                                ...transaction,
                                metadata: transaction.metadata ?? null
                        })
                );
        }

        //-----8: findByTypeAndDateRange (bulk)
        async findByTypeAndDateRange(
                type: string,
                startDate: Date,
                endDate: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Transaction[]> {
                const client = trx ? trx : prismaDbClient;

                const transactionsData = await client.transaction.findMany({
                        where: {
                                transactionType: type as any,
                                createdAt: {
                                        gte: startDate,
                                        lte: endDate
                                }
                        },
                        orderBy: { createdAt: 'desc' }
                });

                return transactionsData.map((transaction) =>
                        Transaction.toEntity({
                                ...transaction,
                                metadata: transaction.metadata ?? null
                        })
                );
        }
}

export const transactionRepository = new TransactionRepository();
