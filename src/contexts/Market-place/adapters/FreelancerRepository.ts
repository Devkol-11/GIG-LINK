import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Freelancer } from '../domain/entities/Freelancer.js';
import { IFreelancerRepository } from '../ports/IFreelancerRepository.js';

export class FreelancerRepository implements IFreelancerRepository {
        async save(freelancer: Freelancer): Promise<Freelancer> {
                const data = freelancer.getState();

                const record = await prismaDbClient.freelancer.upsert({
                        where: { id: data.id },
                        update: data,
                        create: data
                });

                return Freelancer.toEntity(record);
        }

        async findById(id: string): Promise<Freelancer | null> {
                const record = await prismaDbClient.freelancer.findUnique({
                        where: { id }
                });
                return record ? Freelancer.toEntity(record) : null;
        }

        async findByUserId(userId: string): Promise<Freelancer | null> {
                const record = await prismaDbClient.freelancer.findUnique({
                        where: { userId }
                });
                return record ? Freelancer.toEntity(record) : null;
        }

        async findAll(
                options: { skip?: number; take?: number } = {}
        ): Promise<{ freelancers: Freelancer[]; total: number }> {
                const { skip = 0, take = 10 } = options;

                // Fetch data and total count in parallel
                const [records, total] = await Promise.all([
                        prismaDbClient.freelancer.findMany({
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),
                        prismaDbClient.freelancer.count()
                ]);

                const freelancers = records.map((record) => Freelancer.toEntity(record));
                return {
                        freelancers,
                        total
                };
        }

        async delete(id: string): Promise<void> {
                await prismaDbClient.freelancer.delete({ where: { id } });
        }
}

export const freelancerRepository = new FreelancerRepository();
