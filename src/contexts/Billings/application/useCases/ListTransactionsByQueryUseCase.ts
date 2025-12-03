import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { Transaction } from '../../domain/entities/Transactions.js';
import { transactionRepository } from '../../adapters/TransactionRepository.js';

export class ListTransactionsByQueryUseCase {
        constructor(private transactionRepo: ITransactionRepository) {}

        async execute(
                walletId: string,

                filters?: {
                        startDate?: Date;
                        endDate?: Date;
                        status?: string;
                        type?: string;
                }
        ) {
                const transactions: Transaction[] =
                        await this.transactionRepo.findByFilters({
                                walletId,
                                startDate: filters?.startDate,
                                endDate: filters?.endDate,
                                status: filters?.status,
                                type: filters?.type
                        });

                return transactions.map((tx) => tx.getState());
        }
}

export const listTransactionsByQueryUsecase =
        new ListTransactionsByQueryUseCase(transactionRepository);
