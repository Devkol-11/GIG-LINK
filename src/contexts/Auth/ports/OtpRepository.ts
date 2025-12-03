import { Otp } from 'prisma/generated/prisma/client.js';
import type { Prisma } from 'prisma/generated/prisma/client.js';

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
