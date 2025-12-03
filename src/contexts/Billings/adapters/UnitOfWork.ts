import { prismaDbClient } from '@core/database/prisma/prisma.client.js';
import type { PrismaClient } from 'prisma/generated/prisma/client.js';

export class UnitOfWork {
        constructor(private readonly prisma: PrismaClient) {}

        async transaction<T>(callback: (trx: any) => Promise<T>): Promise<T> {
                return this.prisma.$transaction(async (trx: any) => {
                        return callback(trx);
                });
        }
}

export const unitOfWork = new UnitOfWork(prismaDbClient);
