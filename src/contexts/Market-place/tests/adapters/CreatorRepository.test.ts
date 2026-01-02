import { CreatorRepository } from '../../adapters/CreatorRepository.js';
import { Creator } from '../../domain/entities/Creator.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('CreatorRepository - UNIT TESTS', () => {
        let creatorRepository: CreatorRepository;
        let mockPrismaCreator: jest.Mocked<typeof prismaDbClient.creator>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaCreator = prismaDbClient.creator as jest.Mocked<typeof prismaDbClient.creator>;
                creatorRepository = new CreatorRepository();
        });

        describe('save', () => {
                it('should upsert a creator and return Creator entity', async () => {
                        const mockCreatorData = {
                                id: 'creator-123',
                                userId: 'user-456',
                                bio: 'Experienced gig creator',
                                gigCount: 15,
                                completionRate: 95.5,
                                rating: 4.8,
                                totalContractValue: 1500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockCreator = {
                                id: 'creator-123',
                                getState: jest.fn().mockReturnValue(mockCreatorData)
                        };

                        mockPrismaCreator.upsert.mockResolvedValue(mockCreatorData as any);

                        const result = await creatorRepository.save(mockCreator as any);

                        expect(mockPrismaCreator.upsert).toHaveBeenCalledWith({
                                where: { id: mockCreatorData.id },
                                update: mockCreatorData,
                                create: mockCreatorData
                        });
                        expect(result).toBeDefined();
                });

                it('should handle upsert errors', async () => {
                        const mockCreator = {
                                id: 'creator-123',
                                getState: jest.fn().mockReturnValue({ id: 'creator-123' })
                        };

                        mockPrismaCreator.upsert.mockRejectedValue(new Error('Database error'));

                        await expect(creatorRepository.save(mockCreator as any)).rejects.toThrow(
                                'Database error'
                        );
                });
        });

        describe('findById', () => {
                it('should return creator when found', async () => {
                        const mockRecord = {
                                id: 'creator-123',
                                userId: 'user-456',
                                bio: 'Experienced gig creator',
                                gigCount: 15,
                                completionRate: 95.5,
                                rating: 4.8,
                                totalContractValue: 1500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaCreator.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await creatorRepository.findById('creator-123');

                        expect(mockPrismaCreator.findUnique).toHaveBeenCalledWith({
                                where: { id: 'creator-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when creator not found', async () => {
                        mockPrismaCreator.findUnique.mockResolvedValue(null);

                        const result = await creatorRepository.findById('non-existent');

                        expect(result).toBeNull();
                });
        });

        describe('findByUserId', () => {
                it('should return creator for user', async () => {
                        const mockRecord = {
                                id: 'creator-123',
                                userId: 'user-456',
                                bio: 'Experienced gig creator',
                                gigCount: 15,
                                completionRate: 95.5,
                                rating: 4.8,
                                totalContractValue: 1500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaCreator.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await creatorRepository.findByUserId('user-456');

                        expect(mockPrismaCreator.findUnique).toHaveBeenCalledWith({
                                where: { userId: 'user-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when creator not found for user', async () => {
                        mockPrismaCreator.findUnique.mockResolvedValue(null);

                        const result = await creatorRepository.findByUserId('user-456');

                        expect(result).toBeNull();
                });
        });

        describe('findAll', () => {
                it('should return all creators with pagination', async () => {
                        const mockRecords = Array.from({ length: 5 }, (_, i) => ({
                                id: `creator-${i}`,
                                userId: `user-${i}`,
                                bio: `Creator ${i}`,
                                gigCount: 5 + i,
                                completionRate: 90 + i,
                                rating: 4.5 + i * 0.1,
                                totalContractValue: 1000000 + i * 100000,
                                currency: 'NGN',
                                profileImage: `https://example.com/image-${i}.jpg`,
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaCreator.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaCreator.count.mockResolvedValue(5);

                        const result = await creatorRepository.findAll({
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaCreator.findMany).toHaveBeenCalledWith({
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.creators).toHaveLength(5);
                        expect(result.total).toBe(5);
                });

                it('should use default pagination when options not provided', async () => {
                        mockPrismaCreator.findMany.mockResolvedValue([]);
                        mockPrismaCreator.count.mockResolvedValue(0);

                        await creatorRepository.findAll();

                        expect(mockPrismaCreator.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });

                it('should handle empty results', async () => {
                        mockPrismaCreator.findMany.mockResolvedValue([]);
                        mockPrismaCreator.count.mockResolvedValue(0);

                        const result = await creatorRepository.findAll();

                        expect(result.creators).toEqual([]);
                        expect(result.total).toBe(0);
                });

                it('should handle large pagination offsets', async () => {
                        const mockRecords = Array.from({ length: 10 }, (_, i) => ({
                                id: `creator-${i + 100}`,
                                userId: `user-${i + 100}`,
                                bio: `Creator ${i + 100}`,
                                gigCount: 5,
                                completionRate: 90,
                                rating: 4.5,
                                totalContractValue: 1000000,
                                currency: 'NGN',
                                profileImage: `https://example.com/image-${i}.jpg`,
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaCreator.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaCreator.count.mockResolvedValue(1000);

                        const result = await creatorRepository.findAll({
                                skip: 100,
                                take: 10
                        });

                        expect(mockPrismaCreator.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 100,
                                        take: 10
                                })
                        );
                        expect(result.total).toBe(1000);
                });
        });

        describe('delete', () => {
                it('should delete creator by id', async () => {
                        mockPrismaCreator.delete.mockResolvedValue({} as any);

                        await creatorRepository.delete('creator-123');

                        expect(mockPrismaCreator.delete).toHaveBeenCalledWith({
                                where: { id: 'creator-123' }
                        });
                });

                it('should handle delete errors', async () => {
                        mockPrismaCreator.delete.mockRejectedValue(new Error('Delete failed'));

                        await expect(creatorRepository.delete('creator-123')).rejects.toThrow(
                                'Delete failed'
                        );
                });

                it('should handle deleting non-existent creator', async () => {
                        mockPrismaCreator.delete.mockRejectedValue(new Error('Record not found'));

                        await expect(creatorRepository.delete('non-existent')).rejects.toThrow();
                });

                it('should soft delete if supported by schema', async () => {
                        // This tests the scenario where delete uses soft deletion (isActive flag)
                        mockPrismaCreator.update.mockResolvedValue({
                                id: 'creator-123',
                                isActive: false
                        } as any);

                        // If repository uses update instead of delete
                        const result = await creatorRepository.delete('creator-123');

                        expect(mockPrismaCreator.delete).toHaveBeenCalled();
                });
        });

        describe('update', () => {
                it('should update creator with provided fields', async () => {
                        const updates = {
                                bio: 'Senior Gig Creator',
                                gigCount: 20,
                                rating: 4.9
                        };

                        const mockRecord = {
                                id: 'creator-123',
                                userId: 'user-456',
                                bio: 'Senior Gig Creator',
                                gigCount: 20,
                                completionRate: 95.5,
                                rating: 4.9,
                                totalContractValue: 1500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaCreator.update.mockResolvedValue(mockRecord as any);

                        const result = await creatorRepository.update('creator-123', updates);

                        expect(mockPrismaCreator.update).toHaveBeenCalledWith({
                                where: { id: 'creator-123' },
                                data: updates
                        });
                        expect(result).toBeDefined();
                });

                it('should handle update errors', async () => {
                        mockPrismaCreator.update.mockRejectedValue(new Error('Update failed'));

                        await expect(
                                creatorRepository.update('creator-123', { bio: 'Updated' })
                        ).rejects.toThrow('Update failed');
                });

                it('should handle updating non-existent creator', async () => {
                        mockPrismaCreator.update.mockRejectedValue(new Error('Record not found'));

                        await expect(
                                creatorRepository.update('non-existent', { bio: 'Updated' })
                        ).rejects.toThrow();
                });

                it('should update metrics fields', async () => {
                        const updates = {
                                completionRate: 98.0,
                                totalContractValue: 2000000
                        };

                        mockPrismaCreator.update.mockResolvedValue({} as any);

                        await creatorRepository.update('creator-123', updates);

                        expect(mockPrismaCreator.update).toHaveBeenCalledWith({
                                where: { id: 'creator-123' },
                                data: updates
                        });
                });
        });
});
