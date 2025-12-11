import type { Otp } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/database/prisma.client.js';
import { IOtpRepository } from '../ports/IOtpRepository.js';
import type { Prisma } from 'prisma/generated/prisma/client.js';

export class OtpRepository implements IOtpRepository {
        async create(
                userId: string,
                token: string,
                expiresAt: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Otp> {
                const client = trx ? trx : prismaDbClient;

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
                const record = await prismaDbClient.otp.findUnique({
                        where: { token }
                });
                return record;
        }

        async markAsUsed(token: string, trx: Prisma.TransactionClient): Promise<void> {
                const client = trx ? trx : prismaDbClient;

                await client.otp.update({
                        where: { token },
                        data: { used: true }
                });
        }

        async deleteAllForUser(userId: string, trx?: Prisma.TransactionClient): Promise<void> {
                const client = trx ? trx : prismaDbClient;
                await client.otp.deleteMany({
                        where: { userId }
                });
        }
}

export const otpRepository = new OtpRepository();
