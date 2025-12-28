import { IWalletRepository } from '../ports/IWalletRepository.js';
import { Wallet } from '../domain/aggregate-roots/Wallet.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { ConcurrencyError } from '../domain/errors/concurrencyError.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

export class WalletRepository implements IWalletRepository {
        //-----1: findById
        async findById(id: string, trx?: Prisma.TransactionClient): Promise<Wallet | null> {
                const client = trx || prismaDbClient;

                const walletData = await client.wallet.findUnique({
                        where: { id }
                });

                if (!walletData) return null;

                return Wallet.toEntity(walletData);
        }

        //-----2: findByUserId
        async findByUserId(userId: string, trx?: Prisma.TransactionClient): Promise<Wallet | null> {
                const client = trx || prismaDbClient;

                const walletData = await client.wallet.findUnique({
                        where: { userId }
                });

                if (!walletData) return null;

                return Wallet.toEntity(walletData);
        }

        //-----3: save
        async save(wallet: Wallet, trx?: Prisma.TransactionClient): Promise<Wallet> {
                const client = trx || prismaDbClient;

                const state = wallet.getState();

                try {
                        const updatedWallet = await client.wallet.upsert({
                                where: {
                                        id: state.id
                                },
                                update: state,
                                create: state
                        });

                        return Wallet.toEntity(updatedWallet);
                } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                                throw ConcurrencyError.walletModified();
                        }
                        throw error;
                }
        }
}

export const walletRepository = new WalletRepository();
