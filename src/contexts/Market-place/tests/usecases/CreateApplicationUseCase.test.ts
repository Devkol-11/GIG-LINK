import { CreateApplicationUseCase } from '../../application/usecases/createApplicationUseCase.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { FreelancerRepository } from '../../adapters/FreelancerRepository.js';
import { ApplicationRepository } from '../../adapters/ApplicationRepository.js';
import { GigConflict, GigNotFound, NotFound } from '../../domain/errors/DomainErrors.js';
import { createApplicationDTO } from '../../application/dtos/createApplicationDTO.js';

describe('CreateApplicationUseCase', () => {
        let useCase: CreateApplicationUseCase;
        let mockGigRepository: jest.Mocked<GigRepository>;
        let mockApplicationRepository: jest.Mocked<ApplicationRepository>;
        let mockFreelancerRepository: jest.Mocked<FreelancerRepository>;

        beforeEach(() => {
                mockGigRepository = {
                        findById: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                mockApplicationRepository = {
                        save: jest.fn(),
                        findByGigAndFreelancer: jest.fn()
                } as unknown as jest.Mocked<ApplicationRepository>;

                mockFreelancerRepository = {
                        findById: jest.fn()
                } as unknown as jest.Mocked<FreelancerRepository>;

                useCase = new CreateApplicationUseCase(
                        mockGigRepository,
                        mockApplicationRepository,
                        mockFreelancerRepository
                );
        });

        describe('execute', () => {
                const mockData: createApplicationDTO = {
                        gigId: 'gig-123',
                        freelancerId: 'freelancer-456',
                        coverLetter: 'I am interested in this gig'
                };

                it('should successfully create an application', async () => {
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        const mockGig = {
                                id: mockData.gigId,
                                creatorId: 'creator-789',
                                status: 'ACTIVE',
                                checkStatus: jest.fn()
                        };

                        const mockApplication = {
                                id: 'app-101',
                                gigId: mockData.gigId,
                                freelancerId: mockData.freelancerId,
                                coverLetter: mockData.coverLetter,
                                creatorId: mockGig.creatorId
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockApplicationRepository.findByGigAndFreelancer.mockResolvedValue(null);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        const result = await useCase.execute(mockData);

                        expect(mockFreelancerRepository.findById).toHaveBeenCalledWith(mockData.freelancerId);
                        expect(mockGigRepository.findById).toHaveBeenCalledWith(mockData.gigId);
                        expect(mockApplicationRepository.findByGigAndFreelancer).toHaveBeenCalledWith(
                                mockData.gigId,
                                mockData.freelancerId
                        );
                        expect(result).toEqual({ message: 'Application sent successfully' });
                });

                it('should throw NotFound when freelancer does not exist', async () => {
                        mockFreelancerRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(mockData)).rejects.toThrow(NotFound);
                        expect(mockFreelancerRepository.findById).toHaveBeenCalledWith(mockData.freelancerId);
                });

                it('should check if freelancer can apply for gig', async () => {
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(null);

                        try {
                                await useCase.execute(mockData);
                        } catch (error) {
                                // expected
                        }

                        expect(mockFreelancer.canApplyForGig).toHaveBeenCalled();
                });

                it('should throw GigNotFound when gig does not exist', async () => {
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(mockData)).rejects.toThrow(GigNotFound);
                });

                it('should throw GigConflict when application already exists for this gig and freelancer', async () => {
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        const mockGig = {
                                id: mockData.gigId,
                                creatorId: 'creator-789',
                                checkStatus: jest.fn()
                        };

                        const existingApplication = {
                                id: 'existing-app-101',
                                gigId: mockData.gigId,
                                freelancerId: mockData.freelancerId
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockApplicationRepository.findByGigAndFreelancer.mockResolvedValue(
                                existingApplication as any
                        );

                        await expect(useCase.execute(mockData)).rejects.toThrow(GigConflict);
                });

                it('should check gig status before creating application', async () => {
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        const mockGig = {
                                id: mockData.gigId,
                                creatorId: 'creator-789',
                                checkStatus: jest.fn()
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockApplicationRepository.findByGigAndFreelancer.mockResolvedValue(null);
                        mockApplicationRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(mockData);

                        expect(mockGig.checkStatus).toHaveBeenCalled();
                });

                it('should save application to repository with correct data', async () => {
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        const mockGig = {
                                id: mockData.gigId,
                                creatorId: 'creator-789',
                                checkStatus: jest.fn()
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockApplicationRepository.findByGigAndFreelancer.mockResolvedValue(null);
                        mockApplicationRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(mockData);

                        expect(mockApplicationRepository.save).toHaveBeenCalled();
                        const savedApplication = mockApplicationRepository.save.mock.calls[0][0];
                        expect(savedApplication).toBeDefined();
                });

                it('should include creator ID from gig in application', async () => {
                        const creatorId = 'creator-789';
                        const mockFreelancer = {
                                id: mockData.freelancerId,
                                canApplyForGig: jest.fn()
                        };

                        const mockGig = {
                                id: mockData.gigId,
                                creatorId,
                                checkStatus: jest.fn()
                        };

                        mockFreelancerRepository.findById.mockResolvedValue(mockFreelancer as any);
                        mockGigRepository.findById.mockResolvedValue(mockGig as any);
                        mockApplicationRepository.findByGigAndFreelancer.mockResolvedValue(null);
                        mockApplicationRepository.save.mockResolvedValue({} as any);

                        await useCase.execute(mockData);

                        const savedApplication = mockApplicationRepository.save.mock.calls[0][0];
                        expect(savedApplication.creatorId).toBe(creatorId);
                });
        });
});
