import { prismaDbClient } from '@core/database/prisma.client.js';
import { Creator } from '../domain/entities/Creator.js';
import { ICreatorRepository } from '../ports/ICreatorRepository.js';

export class CreatorRepository implements ICreatorRepository {
        async save(creator: Creator): Promise<Creator> {
                const data = creator.getState();

                const record = await prismaDbClient.creator.upsert({
                        where: { id: data.id },
                        update: data,
                        create: data
                });

                return Creator.toEntity(record);
        }

        async findById(id: string): Promise<Creator | null> {
                const record = await prismaDbClient.creator.findUnique({
                        where: { id }
                });
                return record ? Creator.toEntity(record) : null;
        }

        async findByUserId(userId: string): Promise<Creator | null> {
                const record = await prismaDbClient.creator.findUnique({
                        where: { userId }
                });
                return record ? Creator.toEntity(record) : null;
        }

        async findAll(options?: {
                skip?: number;
                take?: number;
        }): Promise<{ creators: Creator[]; total: number }> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                const [records, total] = await Promise.all([
                        prismaDbClient.creator.findMany({
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),

                        prismaDbClient.creator.count()
                ]);

                const creators = records.map((record) =>
                        Creator.toEntity(record)
                );
                return { creators, total };
        }

        async delete(id: string): Promise<void> {
                await prismaDbClient.creator.delete({ where: { id } });
        }
}

export const creatorRepository = new CreatorRepository();
