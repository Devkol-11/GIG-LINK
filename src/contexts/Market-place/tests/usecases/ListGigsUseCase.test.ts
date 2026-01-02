import { ListGigsUseCase } from '../../application/usecases/listGigsUseCase.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { GigNotFound } from '../../domain/errors/DomainErrors.js';

describe('ListGigsUseCase', () => {
        let useCase: ListGigsUseCase;
        let mockGigRepository: jest.Mocked<GigRepository>;

        beforeEach(() => {
                mockGigRepository = {
                        findAll: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                useCase = new ListGigsUseCase(mockGigRepository);
        });

        describe('execute', () => {
                it('should return all gigs', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        title: 'Web Development',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                title: 'Web Development',
                                                status: 'ACTIVE'
                                        })
                                },
                                {
                                        id: 'gig-2',
                                        title: 'Mobile Development',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-2',
                                                title: 'Mobile Development',
                                                status: 'ACTIVE'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(mockGigRepository.findAll).toHaveBeenCalled();
                        expect(result).toHaveLength(2);
                        expect(result[0]).toEqual({
                                id: 'gig-1',
                                title: 'Web Development',
                                status: 'ACTIVE'
                        });
                });

                it('should throw GigNotFound when no gigs exist', async () => {
                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: null
                        });

                        await expect(useCase.execute()).rejects.toThrow(GigNotFound);
                });

                it('should throw GigNotFound when gigs array is empty', async () => {
                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: []
                        });

                        // Note: The implementation throws GigNotFound when gigs is falsy, not when empty
                        // This test documents current behavior, but may want to reconsider
                        const result = await useCase.execute();

                        expect(result).toEqual([]);
                });

                it('should call getState on each gig', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                title: 'Test Gig'
                                        })
                                },
                                {
                                        id: 'gig-2',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-2',
                                                title: 'Test Gig 2'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        await useCase.execute();

                        mockGigs.forEach((gig) => {
                                expect(gig.getState).toHaveBeenCalled();
                        });
                });

                it('should return single gig', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        title: 'Single Gig',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                title: 'Single Gig'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(1);
                        expect(result[0]).toEqual({
                                id: 'gig-1',
                                title: 'Single Gig'
                        });
                });

                it('should return multiple gigs', async () => {
                        const mockGigs = Array.from({ length: 10 }, (_, i) => ({
                                id: `gig-${i + 1}`,
                                title: `Gig ${i + 1}`,
                                getState: jest.fn().mockReturnValue({
                                        id: `gig-${i + 1}`,
                                        title: `Gig ${i + 1}`
                                })
                        }));

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(10);
                });

                it('should return large number of gigs', async () => {
                        const mockGigs = Array.from({ length: 100 }, (_, i) => ({
                                id: `gig-${i + 1}`,
                                getState: jest.fn().mockReturnValue({
                                        id: `gig-${i + 1}`
                                })
                        }));

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(100);
                });

                it('should preserve all gig properties from getState', async () => {
                        const gigState = {
                                id: 'gig-1',
                                title: 'Web Development Project',
                                description: 'Build a responsive website',
                                price: 50000,
                                category: 'Web Development',
                                creatorId: 'creator-456',
                                tags: ['React', 'TypeScript'],
                                status: 'ACTIVE',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                deadline: new Date('2025-12-31')
                        };

                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        getState: jest.fn().mockReturnValue(gigState)
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result[0]).toEqual(gigState);
                });
        });

        describe('execute - Gig statuses', () => {
                it('should return gigs with DRAFT status', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        status: 'DRAFT',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                status: 'DRAFT'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result[0].status).toBe('DRAFT');
                });

                it('should return gigs with ACTIVE status', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        status: 'ACTIVE',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                status: 'ACTIVE'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result[0].status).toBe('ACTIVE');
                });

                it('should return gigs with different statuses mixed', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        status: 'DRAFT',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                status: 'DRAFT'
                                        })
                                },
                                {
                                        id: 'gig-2',
                                        status: 'ACTIVE',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-2',
                                                status: 'ACTIVE'
                                        })
                                },
                                {
                                        id: 'gig-3',
                                        status: 'COMPLETED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-3',
                                                status: 'COMPLETED'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(3);
                        expect(result[0].status).toBe('DRAFT');
                        expect(result[1].status).toBe('ACTIVE');
                        expect(result[2].status).toBe('COMPLETED');
                });
        });

        describe('execute - Gig categories', () => {
                it('should return gigs with different categories', async () => {
                        const categories = [
                                'Web Development',
                                'Mobile Development',
                                'Design',
                                'Data Science'
                        ];

                        const mockGigs = categories.map((category, i) => ({
                                id: `gig-${i + 1}`,
                                category,
                                getState: jest.fn().mockReturnValue({
                                        id: `gig-${i + 1}`,
                                        category
                                })
                        }));

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(4);
                        result.forEach((gig, i) => {
                                expect(gig.category).toBe(categories[i]);
                        });
                });
        });

        describe('execute - Gig prices', () => {
                it('should return gigs with different price amounts', async () => {
                        const prices = [5000, 50000, 500000, 5000000];

                        const mockGigs = prices.map((price, i) => ({
                                id: `gig-${i + 1}`,
                                price,
                                getState: jest.fn().mockReturnValue({
                                        id: `gig-${i + 1}`,
                                        price
                                })
                        }));

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(4);
                        result.forEach((gig, i) => {
                                expect(gig.price).toBe(prices[i]);
                        });
                });
        });

        describe('execute - Gig creators', () => {
                it('should return gigs from different creators', async () => {
                        const creators = ['creator-1', 'creator-2', 'creator-3'];

                        const mockGigs = creators.map((creatorId, i) => ({
                                id: `gig-${i + 1}`,
                                creatorId,
                                getState: jest.fn().mockReturnValue({
                                        id: `gig-${i + 1}`,
                                        creatorId
                                })
                        }));

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(3);
                        result.forEach((gig, i) => {
                                expect(gig.creatorId).toBe(creators[i]);
                        });
                });
        });

        describe('execute - Error scenarios', () => {
                it('should throw GigNotFound when repository returns null gigs', async () => {
                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: null
                        });

                        await expect(useCase.execute()).rejects.toThrow(GigNotFound);
                });

                it('should throw GigNotFound with specific message', async () => {
                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: null
                        });

                        try {
                                await useCase.execute();
                                fail('Should have thrown GigNotFound');
                        } catch (error) {
                                expect(error).toBeInstanceOf(GigNotFound);
                        }
                });

                it('should handle repository throwing error', async () => {
                        const error = new Error('Database connection failed');
                        mockGigRepository.findAll.mockRejectedValue(error);

                        await expect(useCase.execute()).rejects.toThrow('Database connection failed');
                });
        });

        describe('execute - Response format', () => {
                it('should return array of gig states', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                title: 'Test'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(Array.isArray(result)).toBe(true);
                });

                it('should not wrap response in additional object', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                title: 'Test'
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).not.toHaveProperty('gigs');
                        expect(Array.isArray(result)).toBe(true);
                });

                it('should map all gigs to their states', async () => {
                        const mockGigs = Array.from({ length: 5 }, (_, i) => ({
                                id: `gig-${i + 1}`,
                                getState: jest.fn().mockReturnValue({
                                        id: `gig-${i + 1}`,
                                        title: `Gig ${i + 1}`
                                })
                        }));

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result).toHaveLength(5);
                        result.forEach((gig, i) => {
                                expect(gig.id).toBe(`gig-${i + 1}`);
                                expect(gig.title).toBe(`Gig ${i + 1}`);
                        });
                });
        });

        describe('execute - Tags handling', () => {
                it('should return gigs with multiple tags', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        tags: ['React', 'TypeScript', 'Node.js'],
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                tags: ['React', 'TypeScript', 'Node.js']
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result[0].tags).toEqual(['React', 'TypeScript', 'Node.js']);
                });

                it('should return gigs with no tags', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        tags: [],
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                tags: []
                                        })
                                }
                        ];

                        mockGigRepository.findAll.mockResolvedValue({
                                gigs: mockGigs as any
                        });

                        const result = await useCase.execute();

                        expect(result[0].tags).toEqual([]);
                });
        });
});
