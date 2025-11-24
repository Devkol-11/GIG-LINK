import { IAuthRepository } from '../ports/AuthRepository.js';
import type { Prisma } from '@prisma/client';
import type { User } from '@prisma/client';
import { RefreshToken } from '@prisma/client';
import { dbClient } from '@src/core/database/prismaClient.js';
import { logger } from '@src/core/logging/winston.js';

export class AuthRepository implements IAuthRepository {
        async save(
                userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
                trx?: Prisma.TransactionClient
        ): Promise<User> {
                const client = dbClient || trx;

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
                const client = dbClient || trx;

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
                const client = dbClient || trx;

                const updatedUser = await client.user.update({
                        where: { email: email.toLowerCase() },
                        data: updateData
                });

                return updatedUser;
        }

        async findByEmail(email: string): Promise<User | null> {
                const record = await dbClient.user.findUnique({
                        where: { email: email.toLowerCase() }
                });

                return record;
        }

        async findById(id: string): Promise<User | null> {
                const record = await dbClient.user.findUnique({
                        where: { id }
                });

                return record;
        }

        async existsByEmail(email: string): Promise<boolean> {
                const record = await dbClient.user.findUnique({
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
                const client = dbClient || trx;

                await client.user.update({
                        where: { id: userId },
                        data: { passwordHash: newPasswordHash }
                });
        }
}

export const authRepository = new AuthRepository();
