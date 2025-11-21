import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { walletRepository } from '../../infrastructure/WalletRepository.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class ReserveWalletFundsUseCase {
        constructor(private walletRepository: IWalletRepository) {}

        async Execute(walletId: string, amount: number) {
                const wallet = await this.walletRepository.findById(walletId);
                if (!wallet) throw BusinessError.notFound('Wallet not found');

                wallet.reserve(amount); // domain rule handles reserved balance checks
                await this.walletRepository.updateWithVersion(wallet);

                return wallet.getState();
        }
}

export const reserveWalletFundsUseCase = new ReserveWalletFundsUseCase(
        walletRepository
);
