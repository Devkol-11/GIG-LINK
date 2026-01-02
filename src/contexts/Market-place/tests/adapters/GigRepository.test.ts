import { GigRepository } from '../../adapters/GigRepository.js';
import { Gig } from '../../domain/entities/Gig.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('GigRepository - UNIT TESTS', () => {
        let gigRepository: GigRepository;
        let mockPrismaGig: jest.Mocked<typeof prismaDbClient.gig>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaGig = prismaDbClient.gig as jest.Mocked<typeof prismaDbClient.gig>;
                gigRepository = new GigRepository();
        });

        describe('save', () => {
                it('should upsert a gig and return Gig entity', async () => {
                        const mockGigData = {
                                id: 'gig-123',
                                title: 'Web Development',
                                description: 'Build a website',
                                price: 50000,
                                category: 'Web Development',
                                tags: ['React'],
                                deadline: null,
                                status: 'ACTIVE',
                                creatorId: 'creator-456',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockGig = {
                                id: 'gig-123',
                                getState: jest.fn().mockReturnValue(mockGigData)
                        };

                        mockPrismaGig.upsert.mockResolvedValue(mockGigData as any);

                        const result = await gigRepository.save(mockGig as any);

                        expect(mockPrismaGig.upsert).toHaveBeenCalledWith({
                                where: { id: mockGigData.id },
                                update: mockGigData,
                                create: mockGigData
                        });
                        expect(result).toBeDefined();
                });

                it('should handle upsert errors', async () => {
                        const mockGig = {
                                id: 'gig-123',
                                getState: jest.fn().mockReturnValue({ id: 'gig-123' })
                        };

                        mockPrismaGig.upsert.mockRejectedValue(new Error('Database error'));

                        await expect(gigRepository.save(mockGig as any)).rejects.toThrow('Database error');
                });

                it('should call getState on the gig entity', async () => {
                        const mockGigData = {
                                id: 'gig-123',
                                title: 'Test',
                                price: 5000,
                                category: 'Design',
                                description: 'Test gig',
                                tags: [],
                                deadline: null,
                                status: 'DRAFT',
                                creatorId: 'creator-123',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockGig = {
                                id: 'gig-123',
                                getState: jest.fn().mockReturnValue(mockGigData)
                        };

                        mockPrismaGig.upsert.mockResolvedValue(mockGigData as any);

                        await gigRepository.save(mockGig as any);

                        expect(mockGig.getState).toHaveBeenCalled();
                });
        });

        describe('findById', () => {
                it('should return gig when found', async () => {
                        const mockGigRecord = {
                                id: 'gig-123',
                                title: 'Web Development',
                                description: 'Build a website',
                                price: 50000,
                                category: 'Web Development',
                                tags: ['React'],
                                deadline: null,
                                status: 'ACTIVE',
                                creatorId: 'creator-456',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaGig.findUnique.mockResolvedValue(mockGigRecord as any);

                        const result = await gigRepository.findById('gig-123');

                        expect(mockPrismaGig.findUnique).toHaveBeenCalledWith({
                                where: { id: 'gig-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when gig not found', async () => {
                        mockPrismaGig.findUnique.mockResolvedValue(null);

                        const result = await gigRepository.findById('non-existent');

                        expect(result).toBeNull();
                });

                it('should handle database errors', async () => {
                        mockPrismaGig.findUnique.mockRejectedValue(new Error('Database connection failed'));

                        await expect(gigRepository.findById('gig-123')).rejects.toThrow(
                                'Database connection failed'
                        );
                });
        });

        describe('findByCreatorId', () => {
                it('should return paginated gigs for creator', async () => {
                        const mockRecords = [
                                {
                                        id: 'gig-1',
                                        title: 'Gig 1',
                                        price: 5000,
                                        category: 'Web',
                                        description: 'Test',
                                        tags: [],
                                        deadline: null,
                                        status: 'ACTIVE',
                                        creatorId: 'creator-123',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                },
                                {
                                        id: 'gig-2',
                                        title: 'Gig 2',
                                        price: 7000,
                                        category: 'Design',
                                        description: 'Test 2',
                                        tags: [],
                                        deadline: null,
                                        status: 'DRAFT',
                                        creatorId: 'creator-123',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                }
                        ];

                        mockPrismaGig.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaGig.count.mockResolvedValue(2);

                        const result = await gigRepository.findByCreatorId('creator-123', {
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaGig.findMany).toHaveBeenCalledWith({
                                where: { creatorId: 'creator-123' },
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(mockPrismaGig.count).toHaveBeenCalledWith({
                                where: { creatorId: 'creator-123' }
                        });
                        expect(result.gigs).toHaveLength(2);
                        expect(result.total).toBe(2);
                });

                it('should use default pagination when options not provided', async () => {
                        mockPrismaGig.findMany.mockResolvedValue([]);
                        mockPrismaGig.count.mockResolvedValue(0);

                        await gigRepository.findByCreatorId('creator-123');

                        expect(mockPrismaGig.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });

                it('should handle no gigs found', async () => {
                        mockPrismaGig.findMany.mockResolvedValue([]);
                        mockPrismaGig.count.mockResolvedValue(0);

                        const result = await gigRepository.findByCreatorId('creator-123');

                        expect(result.gigs).toEqual([]);
                        expect(result.total).toBe(0);
                });

                it('should order results by createdAt descending', async () => {
                        mockPrismaGig.findMany.mockResolvedValue([]);
                        mockPrismaGig.count.mockResolvedValue(0);

                        await gigRepository.findByCreatorId('creator-123');

                        expect(mockPrismaGig.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        orderBy: { createdAt: 'desc' }
                                })
                        );
                });
        });

        describe('findAll', () => {
                it('should return all gigs with pagination', async () => {
                        const mockRecords = Array.from({ length: 3 }, (_, i) => ({
                                id: `gig-${i}`,
                                title: `Gig ${i}`,
                                price: 5000,
                                category: 'Web',
                                description: 'Test',
                                tags: [],
                                deadline: null,
                                status: 'ACTIVE',
                                creatorId: 'creator-123',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaGig.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaGig.count.mockResolvedValue(3);

                        const result = await gigRepository.findAll({ skip: 0, take: 10 });

                        expect(mockPrismaGig.findMany).toHaveBeenCalledWith({
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.gigs).toHaveLength(3);
                        expect(result.totalValue).toBe(3);
                });

                it('should handle Promise.allSettled results', async () => {
                        mockPrismaGig.findMany.mockResolvedValue([
                                {
                                        id: 'gig-1',
                                        title: 'Gig 1',
                                        price: 5000,
                                        category: 'Web',
                                        description: 'Test',
                                        tags: [],
                                        deadline: null,
                                        status: 'ACTIVE',
                                        creatorId: 'creator-123',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                }
                        ] as any);
                        mockPrismaGig.count.mockResolvedValue(1);

                        const result = await gigRepository.findAll();

                        expect(result.gigs).toHaveLength(1);
                        expect(result.totalValue).toBe(1);
                });

                it('should return empty array when no gigs', async () => {
                        mockPrismaGig.findMany.mockResolvedValue([]);
                        mockPrismaGig.count.mockResolvedValue(0);

                        const result = await gigRepository.findAll();

                        expect(result.gigs).toEqual([]);
                        expect(result.totalValue).toBe(0);
                });

                it('should handle failed findMany gracefully', async () => {
                        mockPrismaGig.findMany.mockRejectedValue(new Error('Find failed'));
                        mockPrismaGig.count.mockResolvedValue(0);

                        const result = await gigRepository.findAll();

                        expect(result.gigs).toEqual([]);
                        expect(result.totalValue).toBe(0);
                });
        });

        describe('update', () => {
                it('should update gig with provided fields', async () => {
                        const updates = {
                                title: 'Updated Title',
                                price: 75000
                        };

                        const mockUpdatedRecord = {
                                id: 'gig-123',
                                title: 'Updated Title',
                                description: 'Original description',
                                price: 75000,
                                category: 'Web Development',
                                tags: ['React'],
                                deadline: null,
                                status: 'ACTIVE',
                                creatorId: 'creator-456',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaGig.update.mockResolvedValue(mockUpdatedRecord as any);

                        const result = await gigRepository.update('gig-123', updates);

                        expect(mockPrismaGig.update).toHaveBeenCalledWith({
                                where: { id: 'gig-123' },
                                data: updates
                        });
                        expect(result).toBeDefined();
                });

                it('should handle update errors', async () => {
                        mockPrismaGig.update.mockRejectedValue(new Error('Update failed'));

                        await expect(gigRepository.update('gig-123', { title: 'New Title' })).rejects.toThrow(
                                'Update failed'
                        );
                });
        });

        describe('delete', () => {
                it('should delete gig by id', async () => {
                        mockPrismaGig.delete.mockResolvedValue({} as any);

                        await gigRepository.delete('gig-123');

                        expect(mockPrismaGig.delete).toHaveBeenCalledWith({
                                where: { id: 'gig-123' }
                        });
                });

                it('should handle delete errors', async () => {
                        mockPrismaGig.delete.mockRejectedValue(new Error('Delete failed'));

                        await expect(gigRepository.delete('gig-123')).rejects.toThrow('Delete failed');
                });

                it('should handle deleting non-existent gig', async () => {
                        mockPrismaGig.delete.mockRejectedValue(new Error('Record not found'));

                        await expect(gigRepository.delete('non-existent')).rejects.toThrow();
                });
        });
});
