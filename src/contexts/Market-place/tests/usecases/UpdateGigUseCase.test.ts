import { UpdateGigUseCase } from '../../application/usecases/updateGigUseCase.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { GigNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';

describe('UpdateGigUseCase', () => {
        let useCase: UpdateGigUseCase;
        let mockGigRepository: jest.Mocked<GigRepository>;

        beforeEach(() => {
                mockGigRepository = {
                        findById: jest.fn(),
                        update: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                useCase = new UpdateGigUseCase(mockGigRepository);
        });

        describe('execute', () => {
                const gigId = 'gig-123';
                const userId = 'creator-456';

                it('should throw GigNotFound when gig does not exist', async () => {
                        mockGigRepository.findById.mockResolvedValue(null);

                        await expect(
                                useCase.execute(gigId, { title: 'Updated Title' }, userId)
                        ).rejects.toThrow(GigNotFound);
                });

                it('should throw NotAllowed when user is not the gig creator', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: 'different-creator'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        await expect(
                                useCase.execute(gigId, { title: 'Updated Title' }, userId)
                        ).rejects.toThrow(NotAllowed);
                });

                it('should successfully update gig title', async () => {
                        const newTitle = 'Updated Web Development Project';
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                title: 'Original Title'
                        };

                        const updatedGig = {
                                id: gigId,
                                creatorId: userId,
                                title: newTitle,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: newTitle
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { title: newTitle }, userId);

                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                title: newTitle
                        });
                        expect(result).toEqual({ id: gigId, title: newTitle });
                });

                it('should successfully update gig description', async () => {
                        const newDescription = 'Updated description';
                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                description: newDescription,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        description: newDescription
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { description: newDescription }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                description: newDescription
                        });
                });

                it('should successfully update gig price', async () => {
                        const newPrice = 75000;
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                price: 50000
                        };

                        const updatedGig = {
                                id: gigId,
                                price: newPrice,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        price: newPrice
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { price: newPrice }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                price: newPrice
                        });
                        expect(result.price).toBe(newPrice);
                });

                it('should successfully update gig category', async () => {
                        const newCategory = 'Mobile Development';
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                category: 'Web Development'
                        };

                        const updatedGig = {
                                id: gigId,
                                category: newCategory,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        category: newCategory
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { category: newCategory }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                category: newCategory
                        });
                });

                it('should successfully update gig tags', async () => {
                        const newTags = ['Vue', 'JavaScript'];
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                tags: ['React', 'TypeScript']
                        };

                        const updatedGig = {
                                id: gigId,
                                tags: newTags,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        tags: newTags
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { tags: newTags }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                tags: newTags
                        });
                        expect(result.tags).toEqual(newTags);
                });

                it('should successfully update gig deadline', async () => {
                        const newDeadline = new Date('2026-12-31');
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                deadline: new Date('2025-12-31')
                        };

                        const updatedGig = {
                                id: gigId,
                                deadline: newDeadline,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        deadline: newDeadline
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { deadline: newDeadline }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                deadline: newDeadline
                        });
                });

                it('should update multiple fields at once', async () => {
                        const updates = {
                                title: 'New Title',
                                description: 'New Description',
                                price: 100000,
                                category: 'Design'
                        };

                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                ...updates,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        ...updates
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, updates, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, updates);
                        expect(result).toMatchObject(updates);
                });

                it('should not update if creator does not own gig', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: 'different-creator'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        try {
                                await useCase.execute(gigId, { title: 'Updated Title' }, userId);
                        } catch (error) {
                                // expected
                        }

                        expect(mockGigRepository.update).not.toHaveBeenCalled();
                });

                it('should return gig state from repository update', async () => {
                        const gigState = {
                                id: gigId,
                                title: 'Updated Title',
                                description: 'Updated Description',
                                price: 50000,
                                category: 'Web Development',
                                creatorId: userId,
                                tags: ['React'],
                                status: 'ACTIVE'
                        };

                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue(gigState)
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { title: 'Updated Title' }, userId);

                        expect(result).toEqual(gigState);
                });
        });

        describe('Partial updates', () => {
                const gigId = 'gig-123';
                const userId = 'creator-456';

                it('should handle partial update with only title', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        title: 'New Title'
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        await useCase.execute(gigId, { title: 'New Title' }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                title: 'New Title'
                        });
                });

                it('should handle partial update with only price', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        price: 75000
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        await useCase.execute(gigId, { price: 75000 }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                price: 75000
                        });
                });

                it('should handle partial update with only tags', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        tags: ['NewTag']
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        await useCase.execute(gigId, { tags: ['NewTag'] }, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {
                                tags: ['NewTag']
                        });
                });

                it('should handle empty updates', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        await useCase.execute(gigId, {}, userId);

                        expect(mockGigRepository.update).toHaveBeenCalledWith(gigId, {});
                });
        });

        describe('Authorization checks', () => {
                const gigId = 'gig-123';

                it('should verify gig exists before checking authorization', async () => {
                        mockGigRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(gigId, { title: 'New' }, 'creator-456')).rejects.toThrow(
                                GigNotFound
                        );

                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                });

                it('should check creator authorization after gig exists check', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: 'different-creator'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        await expect(useCase.execute(gigId, { title: 'New' }, 'creator-456')).rejects.toThrow(
                                NotAllowed
                        );

                        expect(mockGigRepository.findById).toHaveBeenCalled();
                });

                it('should allow gig owner to update', async () => {
                        const ownerId = 'owner-123';
                        const mockGig = {
                                id: gigId,
                                creatorId: ownerId
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { title: 'New' }, ownerId);

                        expect(mockGigRepository.update).toHaveBeenCalled();
                });

                it('should deny non-owner from updating', async () => {
                        const ownerId = 'owner-123';
                        const otherId = 'other-123';

                        const mockGig = {
                                id: gigId,
                                creatorId: ownerId
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        await expect(useCase.execute(gigId, { title: 'New' }, otherId)).rejects.toThrow(
                                NotAllowed
                        );

                        expect(mockGigRepository.update).not.toHaveBeenCalled();
                });
        });

        describe('Price updates', () => {
                const gigId = 'gig-123';
                const userId = 'creator-456';

                it('should update to lower price', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                price: 100000
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        price: 50000
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { price: 50000 }, userId);

                        expect(result.price).toBe(50000);
                });

                it('should update to higher price', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                price: 50000
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        price: 100000
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { price: 100000 }, userId);

                        expect(result.price).toBe(100000);
                });
        });

        describe('Tags updates', () => {
                const gigId = 'gig-123';
                const userId = 'creator-456';

                it('should update tags to empty array', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                tags: ['React', 'TypeScript']
                        };

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        tags: []
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { tags: [] }, userId);

                        expect(result.tags).toEqual([]);
                });

                it('should update to multiple tags', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: userId,
                                tags: []
                        };

                        const newTags = ['React', 'TypeScript', 'Node.js', 'Express'];

                        const updatedGig = {
                                id: gigId,
                                getState: jest.fn().mockReturnValue({
                                        id: gigId,
                                        tags: newTags
                                })
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.update.mockResolvedValue(updatedGig as any);

                        const result = await useCase.execute(gigId, { tags: newTags }, userId);

                        expect(result.tags).toEqual(newTags);
                });
        });
});
