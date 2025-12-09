import { prismaDbClient } from '@core/database/prisma.client.js';
import { Application } from '../domain/entities/Application.js';
import { IApplicationRepository } from '../ports/IApplicationRepository.js';

export class ApplicationRepository implements IApplicationRepository {
        async save(application: Application): Promise<Application> {
                const data = application.getState();

                const record = await prismaDbClient.application.upsert({
                        where: { id: data.id },
                        update: data,
                        create: data
                });

                return Application.toEntity(record);
        }

        async findById(id: string): Promise<Application | null> {
                const record = await prismaDbClient.application.findUnique({
                        where: { id }
                });
                return record ? Application.toEntity(record) : null;
        }

        async findByGigId(
                gigId: string,
                options?: { skip?: number; take?: number }
        ): Promise<{ applications: Application[]; total: number }> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                const [records, total] = await Promise.all([
                        prismaDbClient.application.findMany({
                                where: { gigId },
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),
                        prismaDbClient.application.count({ where: { gigId } })
                ]);

                const applications = records.map((record) =>
                        Application.toEntity(record)
                );
                return { applications, total };
        }

        async findByFreelancerId(
                freelancerId: string,
                options?: { skip?: number; take?: number }
        ): Promise<{ applications: Application[]; total: number }> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                const [records, total] = await Promise.all([
                        prismaDbClient.application.findMany({
                                where: { freelancerId },
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),
                        prismaDbClient.application.count({
                                where: { freelancerId }
                        })
                ]);

                const applications = records.map((record) =>
                        Application.toEntity(record)
                );
                return { applications, total };
        }

        async findByGigIds(
                gigIds: string[],
                options?: { skip?: number; take?: number }
        ): Promise<{ applications: Application[]; total: number }> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                const [records, total] = await Promise.all([
                        prismaDbClient.application.findMany({
                                where: { gigId: { in: gigIds } },
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),
                        prismaDbClient.application.count({
                                where: { gigId: { in: gigIds } }
                        })
                ]);

                const applications = records.map((record) =>
                        Application.toEntity(record)
                );
                return { applications, total };
        }

        async findByGigAndFreelancer(
                gigId: string,
                freelancerId: string
        ): Promise<Application | null> {
                const record = await prismaDbClient.application.findFirst({
                        where: { gigId, freelancerId }
                });
                return record ? Application.toEntity(record) : null;
        }

        async findAll(options?: {
                skip?: number;
                take?: number;
        }): Promise<{ applications: Application[]; total: number }> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                const [records, total] = await Promise.all([
                        prismaDbClient.application.findMany({
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),
                        prismaDbClient.application.count()
                ]);

                const applications = records.map((record) =>
                        Application.toEntity(record)
                );
                return { applications, total };
        }

        async update(application: Application): Promise<Application> {
                const data = application.getState();

                const record = await prismaDbClient.application.update({
                        where: { id: data.id },
                        data
                });

                return Application.toEntity(record);
        }

        async delete(id: string): Promise<void> {
                await prismaDbClient.application.delete({ where: { id } });
        }
}

export const applicationRepository = new ApplicationRepository();
