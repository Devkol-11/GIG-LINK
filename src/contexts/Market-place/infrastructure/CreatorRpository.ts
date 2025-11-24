import { dbClient } from '@src/core/database/prismaClient.js';
import { Creator } from '../domain/entities/Creator.js';
import { ICreatorRepository } from '../ports/ICreatorRepository.js';

export class CreatorRepository implements ICreatorRepository {
        async save(creator: Creator): Promise<Creator> {
                const data = creator.getState();

                const record = await dbClient.creator.upsert({
                        where: { id: data.id },
                        update: data,
                        create: data
                });

                return Creator.toEntity(record);
        }

        async findById(id: string): Promise<Creator | null> {
                const record = await dbClient.creator.findUnique({
                        where: { id }
                });
                return record ? Creator.toEntity(record) : null;
        }

        async findByUserId(userId: string): Promise<Creator | null> {
                const record = await dbClient.creator.findUnique({
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
                        dbClient.creator.findMany({
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),

                        dbClient.creator.count()
                ]);

                const creators = records.map((record) =>
                        Creator.toEntity(record)
                );
                return { creators, total };
        }

        async delete(id: string): Promise<void> {
                await dbClient.creator.delete({ where: { id } });
        }
}

export const creatorRepository = new CreatorRepository();
