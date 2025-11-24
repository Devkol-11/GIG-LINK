import { Otp } from '@prisma/client';
import { dbClient } from '@src/core/database/prismaClient.js';
import { IOtpRepository } from '../ports/OtpRepository.js';
import type { Prisma } from '@prisma/client';

export class OtpRepository implements IOtpRepository {
        async create(
                userId: string,
                token: string,
                expiresAt: Date,
                tx?: Prisma.TransactionClient
        ): Promise<Otp> {
                const client = dbClient || tx;

                const otpRecord = await client.otp.create({
                        data: {
                                userId,
                                token,
                                used: false,
                                createdAt: new Date(),
                                expiresAt
                        }
                });

                return otpRecord;
        }

        async findByToken(token: string): Promise<Otp | null> {
                const record = await dbClient.otp.findUnique({
                        where: { token }
                });
                return record;
        }

        async markAsUsed(
                token: string,
                tx: Prisma.TransactionClient
        ): Promise<void> {
                const client = dbClient || tx;

                await client.otp.update({
                        where: { token },
                        data: { used: true }
                });
        }

        async deleteAllForUser(
                userId: string,
                tx?: Prisma.TransactionClient
        ): Promise<void> {
                const client = dbClient || tx;
                await client.otp.deleteMany({
                        where: { userId }
                });
        }
}

export const otpRepository = new OtpRepository();
