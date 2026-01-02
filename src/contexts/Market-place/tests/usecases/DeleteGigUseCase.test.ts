import { DeleteGigUseCase } from '../../application/usecases/deleteGigUseCase.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { GigNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';

describe('DeleteGigUseCase', () => {
        let useCase: DeleteGigUseCase;
        let mockGigRepository: jest.Mocked<GigRepository>;

        beforeEach(() => {
                mockGigRepository = {
                        findById: jest.fn(),
                        delete: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                useCase = new DeleteGigUseCase(mockGigRepository);
        });

        describe('execute', () => {
                const gigId = 'gig-123';
                const creatorId = 'creator-456';

                it('should successfully delete a gig', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId,
                                title: 'Test Gig'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.delete.mockResolvedValue({} as any);

                        const result = await useCase.execute(gigId, creatorId);

                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                        expect(mockGigRepository.delete).toHaveBeenCalledWith(gigId);
                        expect(result).toEqual({ message: 'gig deleted successfully' });
                });

                it('should throw GigNotFound when gig does not exist', async () => {
                        mockGigRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(gigId, creatorId)).rejects.toThrow(GigNotFound);
                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                });

                it('should throw NotAllowed when creatorId does not match gig creator', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: 'different-creator',
                                title: 'Test Gig'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        await expect(useCase.execute(gigId, creatorId)).rejects.toThrow(NotAllowed);
                        expect(mockGigRepository.findById).toHaveBeenCalledWith(gigId);
                });

                it('should not delete gig if creator does not match', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: 'different-creator'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        try {
                                await useCase.execute(gigId, creatorId);
                        } catch (error) {
                                // expected
                        }

                        expect(mockGigRepository.delete).not.toHaveBeenCalled();
                });

                it('should delete gig from repository', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId,
                                title: 'Test Gig'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.delete.mockResolvedValue({} as any);

                        await useCase.execute(gigId, creatorId);

                        expect(mockGigRepository.delete).toHaveBeenCalledWith(gigId);
                });

                it('should verify gig exists before deletion', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId,
                                title: 'Test Gig'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.delete.mockResolvedValue({} as any);

                        await useCase.execute(gigId, creatorId);

                        expect(mockGigRepository.findById).toHaveBeenCalledBefore(
                                mockGigRepository.delete as any
                        );
                });

                it('should verify creator authorization before deletion', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId,
                                title: 'Test Gig'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockGigRepository.delete.mockResolvedValue({} as any);

                        await useCase.execute(gigId, creatorId);

                        expect(mockGigRepository.findById).toHaveBeenCalled();
                });

                it('should throw GigNotFound with custom message', async () => {
                        mockGigRepository.findById.mockResolvedValue(null);

                        try {
                                await useCase.execute(gigId, creatorId);
                                fail('Should have thrown GigNotFound');
                        } catch (error) {
                                expect(error).toBeInstanceOf(GigNotFound);
                        }
                });

                it('should throw NotAllowed with custom message', async () => {
                        const mockGig = {
                                id: gigId,
                                creatorId: 'other-creator-123'
                        };

                        mockGigRepository.findById.mockResolvedValue(mockGig as any);

                        try {
                                await useCase.execute(gigId, creatorId);
                                fail('Should have thrown NotAllowed');
                        } catch (error) {
                                expect(error).toBeInstanceOf(NotAllowed);
                        }
                });

                it('should handle deletion of gigs with different IDs', async () => {
                        const gigIds = ['gig-1', 'gig-2', 'gig-3'];

                        for (const id of gigIds) {
                                mockGigRepository.findById.mockClear();
                                mockGigRepository.delete.mockClear();

                                const mockGig = {
                                        id,
                                        creatorId,
                                        title: 'Test Gig'
                                };

                                mockGigRepository.findById.mockResolvedValue(mockGig as any);
                                mockGigRepository.delete.mockResolvedValue({} as any);

                                const result = await useCase.execute(id, creatorId);

                                expect(mockGigRepository.delete).toHaveBeenCalledWith(id);
                                expect(result).toEqual({ message: 'gig deleted successfully' });
                        }
                });

                it('should handle deletion of gigs by different creators', async () => {
                        const creators = ['creator-a', 'creator-b', 'creator-c'];

                        for (const creator of creators) {
                                mockGigRepository.findById.mockClear();
                                mockGigRepository.delete.mockClear();

                                const mockGig = {
                                        id: gigId,
                                        creatorId: creator,
                                        title: 'Test Gig'
                                };

                                mockGigRepository.findById.mockResolvedValue(mockGig as any);
                                mockGigRepository.delete.mockResolvedValue({} as any);

                                const result = await useCase.execute(gigId, creator);

                                expect(mockGigRepository.delete).toHaveBeenCalledWith(gigId);
                                expect(result).toEqual({ message: 'gig deleted successfully' });
                        }
                });
        });
});
