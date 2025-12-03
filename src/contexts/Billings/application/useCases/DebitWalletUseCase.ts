import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class DebitWalletUseCase {
        constructor(private walletRepository: IWalletRepository) {}

        async Execute(walletId: string, amount: number) {
                const wallet = await this.walletRepository.findById(walletId);

                if (!wallet) throw new BusinessError('Wallet not found');

                wallet.debit(amount); // domain rule handles negative checks

                await this.walletRepository.save(wallet);

                return wallet.getState();
        }
}

export const debitWalletUseCase = new DebitWalletUseCase(walletRepository);
