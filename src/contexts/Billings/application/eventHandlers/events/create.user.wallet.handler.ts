import { domainEventBus } from '../../../adapters/Domain-EventBus.js';
import { Wallet } from '../../../domain/aggregate-roots/Wallet.js';
import { WalletRepository } from '../../../adapters/WalletRepository.js';

export function CreateUserWalletHandler(walletRepository: WalletRepository) {
        domainEventBus.consume('user:registered', async (payload) => {
                const wallet = Wallet.create({ userId: payload.userId });

                await walletRepository.save(wallet);
        });
}
