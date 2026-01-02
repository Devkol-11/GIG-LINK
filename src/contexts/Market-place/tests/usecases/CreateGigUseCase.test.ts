import { CreateGigUseCase } from '../../application/usecases/createGigUseCase.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { createGigDTO } from '../../application/dtos/createGigDTO.js';

describe('CreateGigUseCase', () => {
        let useCase: CreateGigUseCase;
        let mockGigRepository: jest.Mocked<GigRepository>;

        beforeEach(() => {
                mockGigRepository = {
                        save: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                useCase = new CreateGigUseCase(mockGigRepository);
        });

        describe('execute', () => {
                const mockData: createGigDTO = {
                        title: 'Web Development Project',
                        description: 'Build a responsive website',
                        price: 50000,
                        category: 'Web Development',
                        creatorId: 'creator-123',
                        tags: ['React', 'TypeScript'],
                        deadline: new Date('2025-12-31')
                };

                it('should successfully create a gig', async () => {
                        mockGigRepository.save.mockResolvedValue({} as any);

                        const result = await useCase.execute(mockData);

                        expect(mockGigRepository.save).toHaveBeenCalled();
                        expect(result).toHaveProperty('message', 'gig created successfully');
                        expect(result).toHaveProperty('gig');
                });

                it('should save gig to repository', async () => {
                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(mockData);

                        expect(mockGigRepository.save).toHaveBeenCalled();
                        const savedGig = mockGigRepository.save.mock.calls[0][0];
                        expect(savedGig).toBeDefined();
                });

                it('should create gig with correct properties', async () => {
                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(mockData);

                        const savedGig = mockGigRepository.save.mock.calls[0][0];
                        expect(savedGig).toMatchObject({
                                title: mockData.title,
                                description: mockData.description,
                                price: mockData.price,
                                category: mockData.category,
                                creatorId: mockData.creatorId,
                                tags: mockData.tags,
                                deadline: mockData.deadline
                        });
                });

                it('should return created gig in response', async () => {
                        const createdGig = {
                                id: 'gig-456',
                                title: mockData.title,
                                description: mockData.description,
                                price: mockData.price,
                                category: mockData.category,
                                creatorId: mockData.creatorId,
                                tags: mockData.tags,
                                deadline: mockData.deadline,
                                status: 'DRAFT',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockGigRepository.save.mockResolvedValue(createdGig as any);

                        const result = await useCase.execute(mockData);

                        expect(result.gig).toEqual(expect.any(Object));
                });

                it('should include success message in response', async () => {
                        mockGigRepository.save.mockResolvedValue({} as any);

                        const result = await useCase.execute(mockData);

                        expect(result.message).toBe('gig created successfully');
                });

                it('should handle gig with minimal data', async () => {
                        const minimalData: createGigDTO = {
                                title: 'Simple Task',
                                description: 'Do something',
                                price: 5000,
                                category: 'General',
                                creatorId: 'creator-123',
                                tags: [],
                                deadline: null
                        };

                        mockGigRepository.save.mockResolvedValue({} as any);

                        const result = await useCase.execute(minimalData);

                        expect(result).toHaveProperty('message');
                        expect(mockGigRepository.save).toHaveBeenCalled();
                });

                it('should handle gig with multiple tags', async () => {
                        const dataWithManyTags: createGigDTO = {
                                ...mockData,
                                tags: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL']
                        };

                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(dataWithManyTags);

                        const savedGig = mockGigRepository.save.mock.calls[0][0];
                        expect(savedGig.tags).toHaveLength(5);
                        expect(savedGig.tags).toContain('React');
                        expect(savedGig.tags).toContain('TypeScript');
                });

                it('should handle different price amounts', async () => {
                        const lowPriceData: createGigDTO = { ...mockData, price: 1000 };
                        const highPriceData: createGigDTO = { ...mockData, price: 5000000 };

                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(lowPriceData);
                        expect(mockGigRepository.save).toHaveBeenCalledWith(
                                expect.objectContaining({ price: 1000 })
                        );

                        mockGigRepository.save.mockClear();
                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(highPriceData);
                        expect(mockGigRepository.save).toHaveBeenCalledWith(
                                expect.objectContaining({ price: 5000000 })
                        );
                });

                it('should preserve creatorId in saved gig', async () => {
                        const creatorId = 'unique-creator-id-789';
                        const dataWithSpecificCreator: createGigDTO = {
                                ...mockData,
                                creatorId
                        };

                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(dataWithSpecificCreator);

                        const savedGig = mockGigRepository.save.mock.calls[0][0];
                        expect(savedGig.creatorId).toBe(creatorId);
                });

                it('should handle different categories', async () => {
                        const categories = [
                                'Web Development',
                                'Mobile Development',
                                'Data Science',
                                'Design'
                        ];

                        for (const category of categories) {
                                mockGigRepository.save.mockClear();
                                mockGigRepository.save.mockResolvedValue({} as any);

                                const dataWithCategory: createGigDTO = {
                                        ...mockData,
                                        category
                                };

                                await useCase.execute(dataWithCategory);

                                expect(mockGigRepository.save).toHaveBeenCalledWith(
                                        expect.objectContaining({ category })
                                );
                        }
                });

                it('should handle null deadline', async () => {
                        const dataWithoutDeadline: createGigDTO = {
                                ...mockData,
                                deadline: null
                        };

                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(dataWithoutDeadline);

                        const savedGig = mockGigRepository.save.mock.calls[0][0];
                        expect(savedGig.deadline).toBeNull();
                });

                it('should handle future deadline dates', async () => {
                        const futureDate = new Date();
                        futureDate.setFullYear(futureDate.getFullYear() + 1);

                        const dataWithFutureDeadline: createGigDTO = {
                                ...mockData,
                                deadline: futureDate
                        };

                        mockGigRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(dataWithFutureDeadline);

                        const savedGig = mockGigRepository.save.mock.calls[0][0];
                        expect(savedGig.deadline).toEqual(futureDate);
                });
        });
});
