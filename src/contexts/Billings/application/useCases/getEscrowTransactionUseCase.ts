import { escrowAccountTransactionRepository } from '../../adapters/EscrowAccountTransactionRepository.js';
import { EscrowTransactionNotFoundError } from '../../domain/errors/domainErrors.js';
import { IEscrowAccountTransactionRepository } from '../../ports/IEscrowAccountTransaction.js';

export class GetEscrowAccountTransactionUseCase {
    constructor(private readonly escrowAccountTransactionRepository: IEscrowAccountTransactionRepository) {}

    async Execute(escrowAccountTransactionId: string) {
        const info = await this.escrowAccountTransactionRepository.findById(escrowAccountTransactionId);

        if (!info) throw new EscrowTransactionNotFoundError('no transactions for this account');

        return info.getState();
    }
}

export const getEscrowAccountTransactionUseCase = new GetEscrowAccountTransactionUseCase(
    escrowAccountTransactionRepository
);
