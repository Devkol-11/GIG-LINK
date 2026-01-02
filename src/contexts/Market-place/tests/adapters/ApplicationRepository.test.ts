import { ApplicationRepository } from '../../adapters/ApplicationRepository.js';
import { Application } from '../../domain/entities/Application.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('ApplicationRepository - UNIT TESTS', () => {
        let applicationRepository: ApplicationRepository;
        let mockPrismaApplication: jest.Mocked<typeof prismaDbClient.application>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaApplication = prismaDbClient.application as jest.Mocked<
                        typeof prismaDbClient.application
                >;
                applicationRepository = new ApplicationRepository();
        });

        describe('save', () => {
                it('should upsert an application and return Application entity', async () => {
                        const mockApplicationData = {
                                id: 'app-123',
                                gigId: 'gig-456',
                                freelancerId: 'freelancer-789',
                                creatorId: 'creator-101',
                                status: 'PENDING',
                                coverLetter: 'I am interested',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockApplication = {
                                id: 'app-123',
                                getState: jest.fn().mockReturnValue(mockApplicationData)
                        };

                        mockPrismaApplication.upsert.mockResolvedValue(mockApplicationData as any);

                        const result = await applicationRepository.save(mockApplication as any);

                        expect(mockPrismaApplication.upsert).toHaveBeenCalledWith({
                                where: { id: mockApplicationData.id },
                                update: mockApplicationData,
                                create: mockApplicationData
                        });
                        expect(result).toBeDefined();
                });

                it('should handle upsert errors', async () => {
                        const mockApplication = {
                                id: 'app-123',
                                getState: jest.fn().mockReturnValue({ id: 'app-123' })
                        };

                        mockPrismaApplication.upsert.mockRejectedValue(new Error('Upsert failed'));

                        await expect(applicationRepository.save(mockApplication as any)).rejects.toThrow(
                                'Upsert failed'
                        );
                });
        });

        describe('findById', () => {
                it('should return application when found', async () => {
                        const mockRecord = {
                                id: 'app-123',
                                gigId: 'gig-456',
                                freelancerId: 'freelancer-789',
                                creatorId: 'creator-101',
                                status: 'PENDING',
                                coverLetter: 'I am interested',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaApplication.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await applicationRepository.findById('app-123');

                        expect(mockPrismaApplication.findUnique).toHaveBeenCalledWith({
                                where: { id: 'app-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when application not found', async () => {
                        mockPrismaApplication.findUnique.mockResolvedValue(null);

                        const result = await applicationRepository.findById('non-existent');

                        expect(result).toBeNull();
                });
        });

        describe('findByGigId', () => {
                it('should return paginated applications for gig', async () => {
                        const mockRecords = [
                                {
                                        id: 'app-1',
                                        gigId: 'gig-123',
                                        freelancerId: 'freelancer-1',
                                        creatorId: 'creator-101',
                                        status: 'PENDING',
                                        coverLetter: 'Letter 1',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                },
                                {
                                        id: 'app-2',
                                        gigId: 'gig-123',
                                        freelancerId: 'freelancer-2',
                                        creatorId: 'creator-101',
                                        status: 'ACCEPTED',
                                        coverLetter: 'Letter 2',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                }
                        ];

                        mockPrismaApplication.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaApplication.count.mockResolvedValue(2);

                        const result = await applicationRepository.findByGigId('gig-123', {
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaApplication.findMany).toHaveBeenCalledWith({
                                where: { gigId: 'gig-123' },
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.applications).toHaveLength(2);
                        expect(result.total).toBe(2);
                });

                it('should use default pagination', async () => {
                        mockPrismaApplication.findMany.mockResolvedValue([]);
                        mockPrismaApplication.count.mockResolvedValue(0);

                        await applicationRepository.findByGigId('gig-123');

                        expect(mockPrismaApplication.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });
        });

        describe('findByFreelancerId', () => {
                it('should return paginated applications for freelancer', async () => {
                        const mockRecords = Array.from({ length: 3 }, (_, i) => ({
                                id: `app-${i}`,
                                gigId: `gig-${i}`,
                                freelancerId: 'freelancer-123',
                                creatorId: 'creator-101',
                                status: 'PENDING',
                                coverLetter: `Letter ${i}`,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaApplication.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaApplication.count.mockResolvedValue(3);

                        const result = await applicationRepository.findByFreelancerId('freelancer-123', {
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaApplication.findMany).toHaveBeenCalledWith({
                                where: { freelancerId: 'freelancer-123' },
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.applications).toHaveLength(3);
                        expect(result.total).toBe(3);
                });

                it('should handle no applications found', async () => {
                        mockPrismaApplication.findMany.mockResolvedValue([]);
                        mockPrismaApplication.count.mockResolvedValue(0);

                        const result = await applicationRepository.findByFreelancerId('freelancer-123');

                        expect(result.applications).toEqual([]);
                        expect(result.total).toBe(0);
                });
        });

        describe('findByGigIds', () => {
                it('should return applications for multiple gigs', async () => {
                        const gigIds = ['gig-1', 'gig-2', 'gig-3'];
                        const mockRecords = [
                                {
                                        id: 'app-1',
                                        gigId: 'gig-1',
                                        freelancerId: 'freelancer-1',
                                        creatorId: 'creator-101',
                                        status: 'PENDING',
                                        coverLetter: 'Letter 1',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                },
                                {
                                        id: 'app-2',
                                        gigId: 'gig-2',
                                        freelancerId: 'freelancer-2',
                                        creatorId: 'creator-101',
                                        status: 'ACCEPTED',
                                        coverLetter: 'Letter 2',
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                }
                        ];

                        mockPrismaApplication.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaApplication.count.mockResolvedValue(2);

                        const result = await applicationRepository.findByGigIds(gigIds, {
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaApplication.findMany).toHaveBeenCalledWith({
                                where: { gigId: { in: gigIds } },
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.applications).toHaveLength(2);
                        expect(result.total).toBe(2);
                });

                it('should handle empty gig ids array', async () => {
                        mockPrismaApplication.findMany.mockResolvedValue([]);
                        mockPrismaApplication.count.mockResolvedValue(0);

                        const result = await applicationRepository.findByGigIds([]);

                        expect(mockPrismaApplication.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        where: { gigId: { in: [] } }
                                })
                        );
                        expect(result.applications).toEqual([]);
                });
        });

        describe('findByGigAndFreelancer', () => {
                it('should return application for specific gig and freelancer', async () => {
                        const mockRecord = {
                                id: 'app-123',
                                gigId: 'gig-456',
                                freelancerId: 'freelancer-789',
                                creatorId: 'creator-101',
                                status: 'PENDING',
                                coverLetter: 'I am interested',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaApplication.findFirst.mockResolvedValue(mockRecord as any);

                        const result = await applicationRepository.findByGigAndFreelancer(
                                'gig-456',
                                'freelancer-789'
                        );

                        expect(mockPrismaApplication.findFirst).toHaveBeenCalledWith({
                                where: { gigId: 'gig-456', freelancerId: 'freelancer-789' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when no application found', async () => {
                        mockPrismaApplication.findFirst.mockResolvedValue(null);

                        const result = await applicationRepository.findByGigAndFreelancer(
                                'gig-456',
                                'freelancer-789'
                        );

                        expect(result).toBeNull();
                });
        });

        describe('findAll', () => {
                it('should return all applications with pagination', async () => {
                        const mockRecords = Array.from({ length: 5 }, (_, i) => ({
                                id: `app-${i}`,
                                gigId: `gig-${i}`,
                                freelancerId: `freelancer-${i}`,
                                creatorId: 'creator-101',
                                status: 'PENDING',
                                coverLetter: `Letter ${i}`,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaApplication.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaApplication.count.mockResolvedValue(5);

                        const result = await applicationRepository.findAll({
                                skip: 0,
                                take: 10
                        });

                        expect(result.applications).toHaveLength(5);
                        expect(result.total).toBe(5);
                });

                it('should use default pagination when options not provided', async () => {
                        mockPrismaApplication.findMany.mockResolvedValue([]);
                        mockPrismaApplication.count.mockResolvedValue(0);

                        await applicationRepository.findAll();

                        expect(mockPrismaApplication.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });
        });

        describe('update', () => {
                it('should update application with provided fields', async () => {
                        const updates = {
                                status: 'ACCEPTED',
                                coverLetter: 'Updated letter'
                        };

                        const mockRecord = {
                                id: 'app-123',
                                gigId: 'gig-456',
                                freelancerId: 'freelancer-789',
                                creatorId: 'creator-101',
                                status: 'ACCEPTED',
                                coverLetter: 'Updated letter',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaApplication.update.mockResolvedValue(mockRecord as any);

                        const result = await applicationRepository.update('app-123', updates);

                        expect(mockPrismaApplication.update).toHaveBeenCalledWith({
                                where: { id: 'app-123' },
                                data: updates
                        });
                        expect(result).toBeDefined();
                });

                it('should handle update errors', async () => {
                        mockPrismaApplication.update.mockRejectedValue(new Error('Update failed'));

                        await expect(
                                applicationRepository.update('app-123', { status: 'ACCEPTED' })
                        ).rejects.toThrow('Update failed');
                });
        });

        describe('delete', () => {
                it('should delete application by id', async () => {
                        mockPrismaApplication.delete.mockResolvedValue({} as any);

                        await applicationRepository.delete('app-123');

                        expect(mockPrismaApplication.delete).toHaveBeenCalledWith({
                                where: { id: 'app-123' }
                        });
                });

                it('should handle delete errors', async () => {
                        mockPrismaApplication.delete.mockRejectedValue(new Error('Delete failed'));

                        await expect(applicationRepository.delete('app-123')).rejects.toThrow(
                                'Delete failed'
                        );
                });
        });
});
