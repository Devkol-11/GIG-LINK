import type { PrismaClient } from '@prisma/client';
import { dbClient } from '@src/core/database/prismaClient.js';

export class UnitOfWork {
        constructor(private readonly prisma: PrismaClient) {}

        async transaction<T>(callback: (trx: any) => Promise<T>): Promise<T> {
                return this.prisma.$transaction(async (trx: any) => {
                        return callback(trx);
                });
        }
}

export const unitOfWork = new UnitOfWork(dbClient);
