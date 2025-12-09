import { prismaDbClient } from '@core/database/prisma.client.js';
import { Contract } from '../domain/entities/Contract.js';
import { IContractRepository } from '../ports/IContractRepository.js';

export class ContractRepository implements IContractRepository {
        async save(contract: Contract): Promise<Contract> {
                const data = contract.getState();

                const record = await prismaDbClient.contract.upsert({
                        where: { id: data.id },
                        update: data,
                        create: data
                });

                return Contract.toEntity(record);
        }

        async findById(id: string): Promise<Contract | null> {
                const record = await prismaDbClient.contract.findUnique({
                        where: { id }
                });
                return record ? Contract.toEntity(record) : null;
        }

        async findByGigId(gigId: string): Promise<Contract | null> {
                const record = await prismaDbClient.contract.findUnique({
                        where: { gigId }
                });
                return record ? Contract.toEntity(record) : null;
        }

        async findByCreatorId(
                creatorId: string,
                options?: {
                        skip?: number;
                        take?: number;
                }
        ): Promise<Contract[] | null> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;
                const records = await prismaDbClient.contract.findMany({
                        where: { creatorId },
                        skip,
                        take,
                        orderBy: { createdAt: 'desc' }
                });

                return records.map((record) => Contract.toEntity(record));
        }

        async findByFreeLancerId(
                freelancerId: string,
                options?: { skip?: number; take?: number }
        ): Promise<Contract[] | null> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                const records = await prismaDbClient.contract.findMany({
                        where: { freelancerId },
                        skip,
                        take,
                        orderBy: { createdAt: 'desc' }
                });

                return records.map((record) => Contract.toEntity(record));
        }

        async findByApplicationId(
                applicationId: string
        ): Promise<Contract | null> {
                const record = await prismaDbClient.contract.findUnique({
                        where: { applicationId }
                });
                return record ? Contract.toEntity(record) : null;
        }

        async findAll(options?: {
                skip?: number;
                take?: number;
        }): Promise<{ contracts: Contract[]; total: number }> {
                const skip = options?.skip ?? 0;
                const take = options?.take ?? 10;

                // Fetch both contracts and total count in parallel
                const [records, total] = await Promise.all([
                        prismaDbClient.contract.findMany({
                                skip,
                                take,
                                orderBy: { createdAt: 'desc' }
                        }),
                        prismaDbClient.contract.count()
                ]);

                const contracts = records.map((record) =>
                        Contract.toEntity(record)
                );
                return { contracts, total };
        }

        async delete(id: string): Promise<void> {
                await prismaDbClient.contract.delete({ where: { id } });
        }
}

export const contractRepository = new ContractRepository();
