import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { transactionRepository } from '../../adapters/TransactionRepository.js';

export class GetTransactionUseCase {
        constructor(private transactionRepository: ITransactionRepository) {}

        async Execute(transactionId: string) {
                const transaction =
                        await this.transactionRepository.findById(
                                transactionId
                        );

                if (!transaction)
                        throw BusinessError.notFound('transaction not found');
                return transaction.getState();
        }
}

export const getTransactionUseCase = new GetTransactionUseCase(
        transactionRepository
);
