import { ContractRepository } from '../../adapters/ContractRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('ContractRepository - UNIT TESTS', () => {
        let contractRepository: ContractRepository;
        let mockPrismaContract: jest.Mocked<typeof prismaDbClient.contract>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaContract = prismaDbClient.contract as jest.Mocked<typeof prismaDbClient.contract>;
                contractRepository = new ContractRepository();
        });

        describe('save', () => {
                it('should upsert a contract and return Contract entity', async () => {
                        const mockContractData = {
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockContract = {
                                id: 'contract-123',
                                getState: jest.fn().mockReturnValue(mockContractData)
                        };

                        mockPrismaContract.upsert.mockResolvedValue(mockContractData as any);

                        const result = await contractRepository.save(mockContract as any);

                        expect(mockPrismaContract.upsert).toHaveBeenCalledWith({
                                where: { id: mockContractData.id },
                                update: mockContractData,
                                create: mockContractData
                        });
                        expect(result).toBeDefined();
                });

                it('should handle upsert errors', async () => {
                        const mockContract = {
                                id: 'contract-123',
                                getState: jest.fn().mockReturnValue({ id: 'contract-123' })
                        };

                        mockPrismaContract.upsert.mockRejectedValue(new Error('Database error'));

                        await expect(contractRepository.save(mockContract as any)).rejects.toThrow(
                                'Database error'
                        );
                });
        });

        describe('findById', () => {
                it('should return contract when found', async () => {
                        const mockRecord = {
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaContract.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await contractRepository.findById('contract-123');

                        expect(mockPrismaContract.findUnique).toHaveBeenCalledWith({
                                where: { id: 'contract-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when contract not found', async () => {
                        mockPrismaContract.findUnique.mockResolvedValue(null);

                        const result = await contractRepository.findById('non-existent');

                        expect(result).toBeNull();
                });
        });

        describe('findByGigId', () => {
                it('should return contract for gig', async () => {
                        const mockRecord = {
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaContract.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await contractRepository.findByGigId('gig-456');

                        expect(mockPrismaContract.findUnique).toHaveBeenCalledWith({
                                where: { gigId: 'gig-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when no contract for gig', async () => {
                        mockPrismaContract.findUnique.mockResolvedValue(null);

                        const result = await contractRepository.findByGigId('gig-456');

                        expect(result).toBeNull();
                });
        });

        describe('findByCreatorId', () => {
                it('should return paginated contracts for creator', async () => {
                        const mockRecords = [
                                {
                                        id: 'contract-1',
                                        gigId: 'gig-1',
                                        applicationId: 'app-1',
                                        creatorId: 'creator-123',
                                        freelancerId: 'freelancer-1',
                                        amountKobo: 50000,
                                        currency: 'NGN',
                                        startDate: new Date(),
                                        endDate: null,
                                        status: 'ACTIVE',
                                        paymentStatus: 'PENDING',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                },
                                {
                                        id: 'contract-2',
                                        gigId: 'gig-2',
                                        applicationId: 'app-2',
                                        creatorId: 'creator-123',
                                        freelancerId: 'freelancer-2',
                                        amountKobo: 75000,
                                        currency: 'NGN',
                                        startDate: new Date(),
                                        endDate: null,
                                        status: 'COMPLETED',
                                        paymentStatus: 'PAID',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                }
                        ];

                        mockPrismaContract.findMany.mockResolvedValue(mockRecords as any);

                        const result = await contractRepository.findByCreatorId('creator-123', {
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaContract.findMany).toHaveBeenCalledWith({
                                where: { creatorId: 'creator-123' },
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result).toHaveLength(2);
                });

                it('should use default pagination', async () => {
                        mockPrismaContract.findMany.mockResolvedValue([]);

                        await contractRepository.findByCreatorId('creator-123');

                        expect(mockPrismaContract.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });

                it('should return null when no contracts found', async () => {
                        mockPrismaContract.findMany.mockResolvedValue([]);

                        const result = await contractRepository.findByCreatorId('creator-123');

                        expect(result).toEqual([]);
                });
        });

        describe('findByFreeLancerId', () => {
                it('should return paginated contracts for freelancer', async () => {
                        const mockRecords = Array.from({ length: 3 }, (_, i) => ({
                                id: `contract-${i}`,
                                gigId: `gig-${i}`,
                                applicationId: `app-${i}`,
                                creatorId: `creator-${i}`,
                                freelancerId: 'freelancer-123',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaContract.findMany.mockResolvedValue(mockRecords as any);

                        const result = await contractRepository.findByFreeLancerId('freelancer-123', {
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaContract.findMany).toHaveBeenCalledWith({
                                where: { freelancerId: 'freelancer-123' },
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result).toHaveLength(3);
                });

                it('should use default pagination', async () => {
                        mockPrismaContract.findMany.mockResolvedValue([]);

                        await contractRepository.findByFreeLancerId('freelancer-123');

                        expect(mockPrismaContract.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });
        });

        describe('findByApplicationId', () => {
                it('should return contract for application', async () => {
                        const mockRecord = {
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaContract.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await contractRepository.findByApplicationId('app-789');

                        expect(mockPrismaContract.findUnique).toHaveBeenCalledWith({
                                where: { applicationId: 'app-789' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when no contract for application', async () => {
                        mockPrismaContract.findUnique.mockResolvedValue(null);

                        const result = await contractRepository.findByApplicationId('app-789');

                        expect(result).toBeNull();
                });
        });

        describe('findAll', () => {
                it('should return all contracts with pagination', async () => {
                        const mockRecords = Array.from({ length: 5 }, (_, i) => ({
                                id: `contract-${i}`,
                                gigId: `gig-${i}`,
                                applicationId: `app-${i}`,
                                creatorId: `creator-${i}`,
                                freelancerId: `freelancer-${i}`,
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                status: 'ACTIVE',
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaContract.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaContract.count.mockResolvedValue(5);

                        const result = await contractRepository.findAll({
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaContract.findMany).toHaveBeenCalledWith({
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.contracts).toHaveLength(5);
                        expect(result.total).toBe(5);
                });

                it('should use default pagination when options not provided', async () => {
                        mockPrismaContract.findMany.mockResolvedValue([]);
                        mockPrismaContract.count.mockResolvedValue(0);

                        await contractRepository.findAll();

                        expect(mockPrismaContract.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });

                it('should handle empty results', async () => {
                        mockPrismaContract.findMany.mockResolvedValue([]);
                        mockPrismaContract.count.mockResolvedValue(0);

                        const result = await contractRepository.findAll();

                        expect(result.contracts).toEqual([]);
                        expect(result.total).toBe(0);
                });
        });

        describe('delete', () => {
                it('should delete contract by id', async () => {
                        mockPrismaContract.delete.mockResolvedValue({} as any);

                        await contractRepository.delete('contract-123');

                        expect(mockPrismaContract.delete).toHaveBeenCalledWith({
                                where: { id: 'contract-123' }
                        });
                });

                it('should handle delete errors', async () => {
                        mockPrismaContract.delete.mockRejectedValue(new Error('Delete failed'));

                        await expect(contractRepository.delete('contract-123')).rejects.toThrow(
                                'Delete failed'
                        );
                });

                it('should handle deleting non-existent contract', async () => {
                        mockPrismaContract.delete.mockRejectedValue(new Error('Record not found'));

                        await expect(contractRepository.delete('non-existent')).rejects.toThrow();
                });
        });

        describe('update', () => {
                it('should update contract with provided fields', async () => {
                        const updates = {
                                status: 'COMPLETED',
                                paymentStatus: 'PAID'
                        };

                        const mockRecord = {
                                id: 'contract-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freelancerId: 'freelancer-202',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: new Date(),
                                status: 'COMPLETED',
                                paymentStatus: 'PAID',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaContract.update.mockResolvedValue(mockRecord as any);

                        const result = await contractRepository.update('contract-123', updates);

                        expect(mockPrismaContract.update).toHaveBeenCalledWith({
                                where: { id: 'contract-123' },
                                data: updates
                        });
                        expect(result).toBeDefined();
                });
        });
});
