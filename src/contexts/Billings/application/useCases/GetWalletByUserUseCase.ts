import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { walletRepository } from '../../infrastructure/WalletRepository.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class GetWalletByUserUseCase {
        constructor(private walletRepository: IWalletRepository) {}

        async Execute(userId: string) {
                const wallet = await this.walletRepository.findByUserId(userId);
                if (!wallet) throw BusinessError.notFound('Wallet not found');

                return wallet.getState();
        }
}

export const getWalletByUserUseCase = new GetWalletByUserUseCase(
        walletRepository
);
