import { domainEventBus } from '../../adapters/Domain-EventBus.js';
import { Wallet } from '../../domain/aggregate-roots/Wallet.js';
import { walletRepository } from '../../adapters/WalletRepository.js';

interface payload {
        userId: string;
        email: string;
        firstName: string;
        role: string;
}

export function create_wallet_handler() {
        domainEventBus.subscribe('user:registered', async (payload: payload) => {
                const wallet = Wallet.create({ userId: payload.userId });

                await walletRepository.save(wallet);
        });
}
