import { IUserRepository } from '../ports/IUserRepository.js';
import type { Prisma } from 'prisma/generated/prisma/client.js';
import { User } from '../domain/entities/User.js';
import { RefreshToken } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

export class UserRepository implements IUserRepository {
        async save(userData: User, trx?: Prisma.TransactionClient): Promise<User> {
                const client = trx ? trx : prismaDbClient;

                const state = userData.getState();

                const record = await client.user.upsert({
                        where: { id: state.id },
                        update: state,
                        create: state
                });

                return User.toEntity(record);
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

        async invalidateRefreshToken(userId: string, trx?: Prisma.TransactionClient) {
                const client = trx ?? prismaDbClient;

                await client.refreshToken.deleteMany({ where: { id: userId } });
        }

        async findByEmail(email: string): Promise<User | null> {
                const record = await prismaDbClient.user.findUnique({
                        where: { email: email.toLowerCase() }
                });

                if (!record) return null;

                return User.toEntity(record);
        }

        async findById(id: string): Promise<User | null> {
                const record = await prismaDbClient.user.findUnique({
                        where: { id }
                });

                if (!record) return null;

                return User.toEntity(record);
        }

        async findByGoogleId(googleId: string): Promise<User | null> {
                const record = await prismaDbClient.user.findUnique({
                        where: { googleId }
                });

                if (!record) return null;

                return User.toEntity(record);
        }

        async updateGoogleId(
                userId: string,
                googleId: string,
                trx?: Prisma.TransactionClient
        ): Promise<User | null> {
                const client = trx ? trx : prismaDbClient;

                const record = await client.user.update({
                        where: { id: userId },
                        data: { googleId }
                });

                if (!record) return null;

                return User.toEntity(record);
        }

        async existsByEmail(email: string): Promise<boolean> {
                const record = await prismaDbClient.user.findUnique({
                        where: { email: email.toLowerCase() },
                        select: { id: true }
                });

                return !!record;
        }
}

export const userRepository = new UserRepository();
