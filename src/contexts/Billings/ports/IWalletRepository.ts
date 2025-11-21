import { Prisma } from '@prisma/client';
import { Wallet } from '../domain/entities/Wallet.js';

export interface IWalletRepository {
        findById(
                id: string,
                trx?: Prisma.TransactionClient
        ): Promise<Wallet | null>;

        findByUserId(
                userId: string,
                trx?: Prisma.TransactionClient
        ): Promise<Wallet | null>;

        save(wallet: Wallet, trx?: Prisma.TransactionClient): Promise<Wallet>;

        updateWithVersion(wallet: Wallet): Promise<Wallet>;

        updateBalance(
                walletId: string,
                amount: number,
                trx?: Prisma.TransactionClient
        ): Promise<Wallet>;
}
