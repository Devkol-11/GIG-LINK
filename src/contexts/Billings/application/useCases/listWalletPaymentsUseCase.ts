import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { walletRepository } from '../../adapters/WalletRepository.js';

export class ListWalletPaymentUseCase {
    constructor(
        private readonly walletRepository: IWalletRepository,
        private readonly paymentRepository: IPaymentRepository
    ) {}

    async Execute(userId: string) {
        const wallet = await this.walletRepository.findByUserId(userId);

        if (!wallet) throw new WalletNotFoundError('this user has no wallet'); // systematically impossible

        const walletId = wallet.id;

        const payments = await this.paymentRepository.findAllByWalletId(walletId);

        return payments.map((p) => p.getState());
    }
}

export const listWalletPaymentsUseCase = new ListWalletPaymentUseCase(walletRepository, paymentRepository);
