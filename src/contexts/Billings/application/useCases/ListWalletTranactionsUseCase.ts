import { transactionRepository } from '../../adapters/TransactionRepository.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';

export class ListWalletTransactionsUseCase {
        constructor(private transactionRepository: ITransactionRepository) {}

        async Execute(walletId: string) {
                const transactions =
                        await this.transactionRepository.findByWalletId(
                                walletId
                        );

                return transactions.map((tx) => tx.getState());
        }
}

export const listWalletTransactionsUseCase = new ListWalletTransactionsUseCase(
        transactionRepository
);
