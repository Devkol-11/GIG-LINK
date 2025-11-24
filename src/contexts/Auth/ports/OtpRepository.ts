import { Otp } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export interface IOtpRepository {
        create(
                userId: string,
                token: string,
                expiredAt: Date,
                tx?: Prisma.TransactionClient
        ): Promise<Otp>;

        findByToken(token: string): Promise<Otp | null>;

        markAsUsed(token: string, tx?: Prisma.TransactionClient): Promise<void>;

        deleteAllForUser(
                userId: string,
                tx?: Prisma.TransactionClient
        ): Promise<void>;
}
