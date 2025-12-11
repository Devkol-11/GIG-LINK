import { IAuthRepository } from '../ports/IAuthRepository.js';
import type { Prisma } from 'prisma/generated/prisma/client.js';
import type { User } from 'prisma/generated/prisma/client.js';
import { RefreshToken } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/database/prisma.client.js';
import { logger } from '@src/infrastructure/logging/winston.js';

export class AuthRepository implements IAuthRepository {
        async save(
                userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
                trx?: Prisma.TransactionClient
        ): Promise<User> {
                const client = trx ? trx : prismaDbClient;

                const savedUser = await client.user.create({
                        data: userData
                });
                return savedUser;
        }

        async saveRefreshToken(
                userId: string,
                token: string,
                expiresAt: Date,
                trx?: Prisma.TransactionClient
        ): Promise<RefreshToken> {
                const client = trx ? trx : prismaDbClient;

                return client.refreshToken.create({
                        data: {
                                userId,
                                token,
                                expiresAt
                        }
                });
        }

        async update(
                email: string,
                updateData: Partial<User>,
                trx?: Prisma.TransactionClient
        ): Promise<User> {
                const client = trx ? trx : prismaDbClient;

                const updatedUser = await client.user.update({
                        where: { email: email.toLowerCase() },
                        data: updateData
                });

                return updatedUser;
        }

        async findByEmail(email: string): Promise<User | null> {
                const record = await prismaDbClient.user.findUnique({
                        where: { email: email.toLowerCase() }
                });

                return record;
        }

        async findById(id: string): Promise<User | null> {
                const record = await prismaDbClient.user.findUnique({
                        where: { id }
                });

                return record;
        }

        async findByGoogleId(googleId: string): Promise<User | null> {
                const record = await prismaDbClient.user.findUnique({
                        where: { googleId }
                });

                return record;
        }

        async updateGoogleId(
                userId: string,
                googleId: string,
                trx?: Prisma.TransactionClient
        ): Promise<User> {
                const client = trx ? trx : prismaDbClient;

                const updatedUser = await client.user.update({
                        where: { id: userId },
                        data: { googleId }
                });

                return updatedUser;
        }

        async existsByEmail(email: string): Promise<boolean> {
                const record = await prismaDbClient.user.findUnique({
                        where: { email: email.toLowerCase() },
                        select: { id: true }
                });

                return !!record;
        }

        async updatePassword(
                userId: string,
                newPasswordHash: string,
                trx?: Prisma.TransactionClient
        ): Promise<void> {
                const client = trx ? trx : prismaDbClient;

                await client.user.update({
                        where: { id: userId },
                        data: { passwordHash: newPasswordHash }
                });
        }
}

export const authRepository = new AuthRepository();
