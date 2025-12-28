import type { PrismaClient } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

export class UnitOfWork {
        constructor(private readonly prisma: PrismaClient) {}

        async transaction<T>(callback: (trx: any) => Promise<T>): Promise<T> {
                return this.prisma.$transaction(async (trx) => {
                        return callback(trx);
                });
        }
}

export const unitOfWork = new UnitOfWork(prismaDbClient);
