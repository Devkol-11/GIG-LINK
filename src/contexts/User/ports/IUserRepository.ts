import { User } from '../domain/entities/User.js';
import { RefreshToken } from 'prisma/generated/prisma/client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

export interface IUserRepository {
        save(user: User, trx?: Prisma.TransactionClient): Promise<User>;

        saveRefreshToken(
                userId: string,
                token: string,
                expiresAt: Date,
                trx?: Prisma.TransactionClient
        ): Promise<RefreshToken>;

        invalidateRefreshToken(userId: string, trx?: Prisma.TransactionClient): Promise<void>;

        findByEmail(email: string): Promise<User | null>;

        findById(id: string): Promise<User | null>;

        findByGoogleId(googleId: string): Promise<User | null>;

        updateGoogleId(userId: string, googleId: string, trx: Prisma.TransactionClient): Promise<User | null>;

        existsByEmail(email: string): Promise<boolean>;
}
