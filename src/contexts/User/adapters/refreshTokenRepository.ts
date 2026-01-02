import { Prisma, RefreshToken } from 'prisma/generated/prisma/client.js';
import { IRefreshTokenRepository } from '../ports/IRefreshTokenRepository.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

export class RefreshTokenRepository implements IRefreshTokenRepository {
        async saveUserToken(data: {
                userId: string;
                tokenHash: string;
                expiresAt: Date;
                trx?: Prisma.TransactionClient;
        }): Promise<RefreshToken> {
                const { userId, trx, tokenHash, expiresAt } = data;

                const client = trx ?? prismaDbClient;

                const record = await client.refreshToken.create({
                        data: {
                                userId,
                                adminId: undefined,
                                tokenHash,
                                is_revoked: false,
                                expiresAt,
                                createdAt: new Date()
                        }
                });

                return record;
        }

        async saveAdminToken(data: {
                adminId: string;
                tokenHash: string;
                expiresAt: Date;
        }): Promise<RefreshToken> {
                const { adminId, tokenHash, expiresAt } = data;

                const record = await prismaDbClient.refreshToken.create({
                        data: {
                                userId: '',
                                adminId,
                                tokenHash,
                                is_revoked: false,
                                expiresAt,
                                createdAt: new Date()
                        }
                });

                return record;
        }
}
