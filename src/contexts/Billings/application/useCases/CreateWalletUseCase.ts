import { walletRepository } from '../../infrastructure/WalletRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { Wallet } from '../../domain/entities/Wallet.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class CreateWalletUseCase {
        constructor(private walletRepository: IWalletRepository) {}

        async Execute(userId: string) {
                // Check if user already has a wallet -- each user is ONLY permitted ONE wallet
                const existing =
                        await this.walletRepository.findByUserId(userId);

                if (existing !== null)
                        throw new BusinessError(
                                'Wallet already exists for this user'
                        );

                const wallet = Wallet.create({
                        userId
                });

                const saved = await this.walletRepository.save(wallet);

                return saved.getState();
        }
}

export const createWalletUseCase = new CreateWalletUseCase(walletRepository);
