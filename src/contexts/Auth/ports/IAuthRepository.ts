import { User } from 'prisma/generated/prisma/client.js';
import { RefreshToken } from 'prisma/generated/prisma/client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

export interface IAuthRepository {
        save(
                userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
                trx?: Prisma.TransactionClient
        ): Promise<User>;

        saveRefreshToken(
                userId: string,
                token: string,
                expiresAt: Date,
                trx?: Prisma.TransactionClient
        ): Promise<RefreshToken>;

        update(
                email: string,
                updateData: Partial<User>,
                trx?: Prisma.TransactionClient
        ): Promise<User>;

        findByEmail(email: string): Promise<User | null>;

        findById(id: string): Promise<User | null>;

        findByGoogleId(googleId: string): Promise<User | null>;

        updateGoogleId(
                userId: string,
                googleId: string,
                trx: Prisma.TransactionClient
        ): Promise<User>;

        existsByEmail(email: string): Promise<boolean>;

        updatePassword(
                userId: string,
                newPasswordHash: string,
                trx?: Prisma.TransactionClient
        ): Promise<void>;
}
