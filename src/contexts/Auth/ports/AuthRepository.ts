import { User } from '@prisma/client';
import { RefreshToken } from '@prisma/client';
import { Prisma } from '@prisma/client';

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

        existsByEmail(email: string): Promise<boolean>;

        updatePassword(
                userId: string,
                newPasswordHash: string,
                trx?: Prisma.TransactionClient
        ): Promise<void>;
}
