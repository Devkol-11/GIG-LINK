import { GetGigUseCase } from '../../application/usecases/getGigUseCase.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { GigNotFound } from '../../domain/errors/DomainErrors.js';

describe('GetGigUseCase', () => {
        let useCase: GetGigUseCase;
        let mockGigRepository: jest.Mocked<GigRepository>;

        beforeEach(() => {
                mockGigRepository = {
                        findById: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                useCase = new GetGigUseCase(mockGigRepository);
        });

        describe('execute', () => {
                const gigId = 'gig-123';

                it('should return gig when found', async () => {
                        const mockGig = {
                                id: gigId,
                                title: 'Web Development Project',
                                description: 'Build a responsive website',
                                price: 50000,
                                category: 'Web Development',
                                creatorId: 'creator-456',
                                tags: ['React', 'TypeScript'],
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Web Development Project',
                                        description: 'Build a responsive website',
                                        price: 50000,
                                        category: 'Web Development',
                                        creatorId: 'creator-456',
                                        tags: ['React', 'TypeScript'],
                                        status: 'ACTIVE'
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                        expect(result).toEqual({
                                id: gigId,
                                title: 'Web Development Project',
                                description: 'Build a responsive website',
                                price: 50000,
                                category: 'Web Development',
                                creatorId: 'creator-456',
                                tags: ['React', 'TypeScript'],
                                status: 'ACTIVE'
                        });
                });

                it('should throw GigNotFound when gig does not exist', async () => {
                        mockGigRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(gigId)).rejects.toThrow(GigNotFound);
                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                });

                it('should call getState on gig', async () => {
                        const mockGig = {
                                id: gigId,
                                title: 'Test Gig',
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Test Gig'
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        await useCase.execute(gigId);

                        expect(mockGig.getState).toHaveBeenCalled();
                });

                it('should return gig state exactly as provided by getState', async () => {
                        const expectedState = {
                                id: gigId,
                                title: 'Web Development Project',
                                description: 'Build a responsive website',
                                price: 50000,
                                category: 'Web Development',
                                creatorId: 'creator-456',
                                tags: ['React', 'TypeScript'],
                                status: 'ACTIVE',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue(expectedState)
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(result).toEqual(expectedState);
                });

                it('should handle gigs with different statuses', async () => {
                        const statuses = ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'];

                        for (const status of statuses) {
                                mockGigRepository.findById.mockClear();

                                const mockGig = {
                                        id: gigId,
                                        title: 'Test Gig',
                                        status,
                                        getState: jest.fn().mockReturnValue({
                                                id: gigId,
                                                title: 'Test Gig',
                                                status
                                        })
                                };

                                mockGigRepository.findById.mockResolvedValue(mockGig as any);

                                const result = await useCase.execute(gigId);

                                expect(result.status).toBe(status);
                        }
                });

                it('should handle gigs with different categories', async () => {
                        const categories = [
                                'Web Development',
                                'Mobile Development',
                                'Design',
                                'Data Science'
                        ];

                        for (const category of categories) {
                                mockGigRepository.findById.mockClear();

                                const mockGig = {
                                        id: gigId,
                                        title: 'Test Gig',
                                        category,
                                        getState: jest.fn().mockReturnValue({
                                                id: gigId,
                                                title: 'Test Gig',
                                                category
                                        })
                                };

                                mockGigRepository.findById.mockResolvedValue(mockGig as any);

                                const result = await useCase.execute(gigId);

                                expect(result.category).toBe(category);
                        }
                });

                it('should handle gigs with multiple tags', async () => {
                        const tags = ['React', 'TypeScript', 'Node.js', 'Express'];

                        const mockGig = {
                                id: gigId,
                                title: 'Test Gig',
                                tags,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Test Gig',
                                        tags
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(result.tags).toEqual(tags);
                        expect(result.tags).toHaveLength(4);
                });

                it('should handle gigs with no tags', async () => {
                        const mockGig = {
                                id: gigId,
                                title: 'Test Gig',
                                tags: [],
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Test Gig',
                                        tags: []
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(result.tags).toEqual([]);
                });

                it('should handle different price amounts', async () => {
                        const prices = [5000, 50000, 500000, 5000000];

                        for (const price of prices) {
                                mockGigRepository.findById.mockClear();

                                const mockGig = {
                                        id: gigId,
                                        title: 'Test Gig',
                                        price,
                                        getState: jest.fn().mockReturnValue({
                                                id: gigId,
                                                title: 'Test Gig',
                                                price
                                        })
                                };

                                mockGigRepository.findById.mockResolvedValue(mockGig as any);

                                const result = await useCase.execute(gigId);

                                expect(result.price).toBe(price);
                        }
                });

                it('should throw GigNotFound when repository returns null', async () => {
                        mockGigRepository.findById.mockResolvedValue(null);

                        try {
                                await useCase.execute(gigId);
                                fail('Should have thrown GigNotFound');
                        } catch (error) {
                                expect(error).toBeInstanceOf(GigNotFound);
                        }
                });

                it('should pass correct gigId to repository', async () => {
                        const testGigId = 'specific-gig-id-789';
                        const mockGig = {
                                id: testGigId,
                                getState: jest.fn().mockReturnValue({ id: testGigId })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        await useCase.execute(testGigId);

                        expect(mockGigRepository.findById).toHaveBeenCalledWith(testGigId);
                });

                it('should handle gigs with deadline', async () => {
                        const deadline = new Date('2025-12-31');
                        const mockGig = {
                                id: gigId,
                                title: 'Test Gig',
                                deadline,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Test Gig',
                                        deadline
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(result.deadline).toEqual(deadline);
                });

                it('should handle gigs without deadline', async () => {
                        const mockGig = {
                                id: gigId,
                                title: 'Test Gig',
                                deadline: null,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Test Gig',
                                        deadline: null
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(result.deadline).toBeNull();
                });

                it('should handle long descriptions', async () => {
                        const longDescription = 'This is a very long description ' + 'x'.repeat(1000);
                        const mockGig = {
                                id: gigId,
                                title: 'Test Gig',
                                description: longDescription,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'Test Gig',
                                        description: longDescription
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        const result = await useCase.execute(gigId);

                        expect(result.description).toBe(longDescription);
                });

                it('should handle different creator IDs', async () => {
                        const creatorIds = ['creator-1', 'creator-2', 'creator-3'];

                        for (const creatorId of creatorIds) {
                                mockGigRepository.findById.mockClear();

                                const mockGig = {
                                        id: gigId,
                                        title: 'Test Gig',
                                        creatorId,
                                        getState: jest.fn().mockReturnValue({
                                                id: gigId,
                                                title: 'Test Gig',
                                                creatorId
                                        })
                                };

                                mockGigRepository.findById.mockResolvedValue(mockGig as any);

                                const result = await useCase.execute(gigId);

                                expect(result.creatorId).toBe(creatorId);
                        }
                });
        });
});
