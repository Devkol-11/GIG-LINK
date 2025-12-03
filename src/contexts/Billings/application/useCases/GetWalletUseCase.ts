import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class GetWalletUseCase {
        constructor(private walletRepository: IWalletRepository) {}

        async Execute(walletId: string) {
                const wallet = await this.walletRepository.findById(walletId);
                if (!wallet) throw new BusinessError('Wallet not found');

                return wallet.getState();
        }
}

export const getWalletUseCase = new GetWalletUseCase(walletRepository);
