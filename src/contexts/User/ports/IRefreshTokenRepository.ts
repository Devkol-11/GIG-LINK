import { Prisma, RefreshToken } from 'prisma/generated/prisma/client.js';

export interface IRefreshTokenRepository {
        saveUserToken(data: {
                userId: string;
                tokenHash: string;
                expiresAt: Date;
                trx?: Prisma.TransactionClient;
        }): Promise<RefreshToken>;

        saveAdminToken(data: { adminId: string; tokenHash: string; expiresAt: Date }): Promise<RefreshToken>;
}
