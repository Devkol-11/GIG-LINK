import { FreelancerRepository } from '../../adapters/FreelancerRepository.js';
import { Freelancer } from '../../domain/entities/Freelancer.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('FreelancerRepository - UNIT TESTS', () => {
        let freelancerRepository: FreelancerRepository;
        let mockPrismaFreelancer: jest.Mocked<typeof prismaDbClient.freelancer>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaFreelancer = prismaDbClient.freelancer as jest.Mocked<
                        typeof prismaDbClient.freelancer
                >;
                freelancerRepository = new FreelancerRepository();
        });

        describe('save', () => {
                it('should upsert a freelancer and return Freelancer entity', async () => {
                        const mockFreelancerData = {
                                id: 'freelancer-123',
                                userId: 'user-456',
                                bio: 'Experienced developer',
                                skills: ['TypeScript', 'React'],
                                rating: 4.8,
                                totalEarnings: 500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockFreelancer = {
                                id: 'freelancer-123',
                                getState: jest.fn().mockReturnValue(mockFreelancerData)
                        };

                        mockPrismaFreelancer.upsert.mockResolvedValue(mockFreelancerData as any);

                        const result = await freelancerRepository.save(mockFreelancer as any);

                        expect(mockPrismaFreelancer.upsert).toHaveBeenCalledWith({
                                where: { id: mockFreelancerData.id },
                                update: mockFreelancerData,
                                create: mockFreelancerData
                        });
                        expect(result).toBeDefined();
                });

                it('should handle upsert errors', async () => {
                        const mockFreelancer = {
                                id: 'freelancer-123',
                                getState: jest.fn().mockReturnValue({ id: 'freelancer-123' })
                        };

                        mockPrismaFreelancer.upsert.mockRejectedValue(new Error('Database error'));

                        await expect(freelancerRepository.save(mockFreelancer as any)).rejects.toThrow(
                                'Database error'
                        );
                });
        });

        describe('findById', () => {
                it('should return freelancer when found', async () => {
                        const mockRecord = {
                                id: 'freelancer-123',
                                userId: 'user-456',
                                bio: 'Experienced developer',
                                skills: ['TypeScript', 'React'],
                                rating: 4.8,
                                totalEarnings: 500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaFreelancer.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await freelancerRepository.findById('freelancer-123');

                        expect(mockPrismaFreelancer.findUnique).toHaveBeenCalledWith({
                                where: { id: 'freelancer-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when freelancer not found', async () => {
                        mockPrismaFreelancer.findUnique.mockResolvedValue(null);

                        const result = await freelancerRepository.findById('non-existent');

                        expect(result).toBeNull();
                });
        });

        describe('findByUserId', () => {
                it('should return freelancer for user', async () => {
                        const mockRecord = {
                                id: 'freelancer-123',
                                userId: 'user-456',
                                bio: 'Experienced developer',
                                skills: ['TypeScript', 'React'],
                                rating: 4.8,
                                totalEarnings: 500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaFreelancer.findUnique.mockResolvedValue(mockRecord as any);

                        const result = await freelancerRepository.findByUserId('user-456');

                        expect(mockPrismaFreelancer.findUnique).toHaveBeenCalledWith({
                                where: { userId: 'user-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when freelancer not found for user', async () => {
                        mockPrismaFreelancer.findUnique.mockResolvedValue(null);

                        const result = await freelancerRepository.findByUserId('user-456');

                        expect(result).toBeNull();
                });
        });

        describe('findAll', () => {
                it('should return all freelancers with pagination', async () => {
                        const mockRecords = Array.from({ length: 5 }, (_, i) => ({
                                id: `freelancer-${i}`,
                                userId: `user-${i}`,
                                bio: `Developer ${i}`,
                                skills: ['TypeScript'],
                                rating: 4.5 + i * 0.1,
                                totalEarnings: 500000,
                                currency: 'NGN',
                                profileImage: `https://example.com/image-${i}.jpg`,
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaFreelancer.findMany.mockResolvedValue(mockRecords as any);
                        mockPrismaFreelancer.count.mockResolvedValue(5);

                        const result = await freelancerRepository.findAll({
                                skip: 0,
                                take: 10
                        });

                        expect(mockPrismaFreelancer.findMany).toHaveBeenCalledWith({
                                skip: 0,
                                take: 10,
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result.freelancers).toHaveLength(5);
                        expect(result.total).toBe(5);
                });

                it('should use default pagination when options not provided', async () => {
                        mockPrismaFreelancer.findMany.mockResolvedValue([]);
                        mockPrismaFreelancer.count.mockResolvedValue(0);

                        await freelancerRepository.findAll();

                        expect(mockPrismaFreelancer.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 0,
                                        take: 10
                                })
                        );
                });

                it('should handle empty results', async () => {
                        mockPrismaFreelancer.findMany.mockResolvedValue([]);
                        mockPrismaFreelancer.count.mockResolvedValue(0);

                        const result = await freelancerRepository.findAll();

                        expect(result.freelancers).toEqual([]);
                        expect(result.total).toBe(0);
                });

                it('should handle custom pagination', async () => {
                        const mockRecords = Array.from({ length: 20 }, (_, i) => ({
                                id: `freelancer-${i}`,
                                userId: `user-${i}`,
                                bio: `Developer ${i}`,
                                skills: ['TypeScript'],
                                rating: 4.5,
                                totalEarnings: 500000,
                                currency: 'NGN',
                                profileImage: `https://example.com/image-${i}.jpg`,
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        }));

                        mockPrismaFreelancer.findMany.mockResolvedValue(mockRecords.slice(10, 20) as any);
                        mockPrismaFreelancer.count.mockResolvedValue(100);

                        const result = await freelancerRepository.findAll({
                                skip: 10,
                                take: 20
                        });

                        expect(mockPrismaFreelancer.findMany).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        skip: 10,
                                        take: 20
                                })
                        );
                        expect(result.total).toBe(100);
                });
        });

        describe('delete', () => {
                it('should delete freelancer by id', async () => {
                        mockPrismaFreelancer.delete.mockResolvedValue({} as any);

                        await freelancerRepository.delete('freelancer-123');

                        expect(mockPrismaFreelancer.delete).toHaveBeenCalledWith({
                                where: { id: 'freelancer-123' }
                        });
                });

                it('should handle delete errors', async () => {
                        mockPrismaFreelancer.delete.mockRejectedValue(new Error('Delete failed'));

                        await expect(freelancerRepository.delete('freelancer-123')).rejects.toThrow(
                                'Delete failed'
                        );
                });

                it('should handle deleting non-existent freelancer', async () => {
                        mockPrismaFreelancer.delete.mockRejectedValue(new Error('Record not found'));

                        await expect(freelancerRepository.delete('non-existent')).rejects.toThrow();
                });
        });

        describe('update', () => {
                it('should update freelancer with provided fields', async () => {
                        const updates = {
                                bio: 'Senior Developer',
                                rating: 4.9,
                                isVerified: true
                        };

                        const mockRecord = {
                                id: 'freelancer-123',
                                userId: 'user-456',
                                bio: 'Senior Developer',
                                skills: ['TypeScript', 'React'],
                                rating: 4.9,
                                totalEarnings: 500000,
                                currency: 'NGN',
                                profileImage: 'https://example.com/image.jpg',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaFreelancer.update.mockResolvedValue(mockRecord as any);

                        const result = await freelancerRepository.update('freelancer-123', updates);

                        expect(mockPrismaFreelancer.update).toHaveBeenCalledWith({
                                where: { id: 'freelancer-123' },
                                data: updates
                        });
                        expect(result).toBeDefined();
                });

                it('should handle update errors', async () => {
                        mockPrismaFreelancer.update.mockRejectedValue(new Error('Update failed'));

                        await expect(
                                freelancerRepository.update('freelancer-123', { bio: 'Updated' })
                        ).rejects.toThrow('Update failed');
                });

                it('should handle updating non-existent freelancer', async () => {
                        mockPrismaFreelancer.update.mockRejectedValue(new Error('Record not found'));

                        await expect(
                                freelancerRepository.update('non-existent', { bio: 'Updated' })
                        ).rejects.toThrow();
                });
        });
});
