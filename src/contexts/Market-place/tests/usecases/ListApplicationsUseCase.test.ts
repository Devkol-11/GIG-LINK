import { ListApplicationsUseCase } from '../../application/usecases/listApplicationsUseCase.js';
import { ApplicationRepository } from '../../adapters/ApplicationRepository.js';
import { GigRepository } from '../../adapters/GigRepository.js';
import { GigNotFound } from '../../domain/errors/DomainErrors.js';

describe('ListApplicationsUseCase', () => {
        let useCase: ListApplicationsUseCase;
        let mockApplicationRepository: jest.Mocked<ApplicationRepository>;
        let mockGigRepository: jest.Mocked<GigRepository>;

        beforeEach(() => {
                mockApplicationRepository = {
                        findByFreelancerId: jest.fn(),
                        findByGigIds: jest.fn()
                } as unknown as jest.Mocked<ApplicationRepository>;

                mockGigRepository = {
                        findByCreatorId: jest.fn()
                } as unknown as jest.Mocked<GigRepository>;

                useCase = new ListApplicationsUseCase(mockApplicationRepository, mockGigRepository);
        });

        describe('execute - FREELANCER role', () => {
                const userId = 'freelancer-123';
                const role: 'CREATOR' | 'FREELANCER' = 'FREELANCER';

                it('should return applications for freelancer', async () => {
                        const mockApplications = [
                                {
                                        id: 'app-1',
                                        gigId: 'gig-1',
                                        freelancerId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'app-1',
                                                gigId: 'gig-1',
                                                freelancerId: userId
                                        })
                                },
                                {
                                        id: 'app-2',
                                        gigId: 'gig-2',
                                        freelancerId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'app-2',
                                                gigId: 'gig-2',
                                                freelancerId: userId
                                        })
                                }
                        ];

                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: mockApplications as any,
                                total: 2
                        });

                        const result = await useCase.execute(userId, role, 1, 10);

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 0,
                                take: 10
                        });
                        expect(result.applications).toHaveLength(2);
                        expect(result.total).toBe(2);
                        expect(result.page).toBe(1);
                        expect(result.totalPages).toBe(1);
                });

                it('should handle pagination for freelancer applications', async () => {
                        const mockApplications = Array.from({ length: 5 }, (_, i) => ({
                                id: `app-${i + 1}`,
                                getState: jest.fn().mockReturnValue({
                                        id: `app-${i + 1}`
                                })
                        }));

                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: mockApplications as any,
                                total: 25
                        });

                        const result = await useCase.execute(userId, role, 2, 5);

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 5,
                                take: 5
                        });
                        expect(result.applications).toHaveLength(5);
                        expect(result.page).toBe(2);
                        expect(result.totalPages).toBe(5);
                });

                it('should return empty list when freelancer has no applications', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        const result = await useCase.execute(userId, role, 1, 10);

                        expect(result.applications).toEqual([]);
                        expect(result.total).toBe(0);
                });

                it('should call getState on each application', async () => {
                        const mockApplications = [
                                {
                                        id: 'app-1',
                                        getState: jest.fn().mockReturnValue({ id: 'app-1' })
                                },
                                {
                                        id: 'app-2',
                                        getState: jest.fn().mockReturnValue({ id: 'app-2' })
                                }
                        ];

                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: mockApplications as any,
                                total: 2
                        });

                        await useCase.execute(userId, role, 1, 10);

                        mockApplications.forEach((app) => {
                                expect(app.getState).toHaveBeenCalled();
                        });
                });
        });

        describe('execute - CREATOR role', () => {
                const userId = 'creator-456';
                const role: 'CREATOR' | 'FREELANCER' = 'CREATOR';

                it('should return applications for creator gigs', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        creatorId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-1',
                                                creatorId: userId
                                        })
                                },
                                {
                                        id: 'gig-2',
                                        creatorId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'gig-2',
                                                creatorId: userId
                                        })
                                }
                        ];

                        const mockApplications = [
                                {
                                        id: 'app-1',
                                        gigId: 'gig-1',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'app-1',
                                                gigId: 'gig-1'
                                        })
                                },
                                {
                                        id: 'app-2',
                                        gigId: 'gig-2',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'app-2',
                                                gigId: 'gig-2'
                                        })
                                }
                        ];

                        mockGigRepository.findByCreatorId.mockResolvedValue({
                                gigs: mockGigs as any
                        });
                        mockApplicationRepository.findByGigIds.mockResolvedValue({
                                applications: mockApplications as any,
                                total: 2
                        });

                        const result = await useCase.execute(userId, role, 1, 10);

                        expect(mockGigRepository.findByCreatorId).toHaveBeenCalledWith(userId);
                        expect(mockApplicationRepository.findByGigIds).toHaveBeenCalledWith(
                                ['gig-1', 'gig-2'],
                                { skip: 0, take: 10 }
                        );
                        expect(result.applications).toHaveLength(2);
                        expect(result.total).toBe(2);
                });

                it('should throw GigNotFound when creator has no gigs', async () => {
                        mockGigRepository.findByCreatorId.mockResolvedValue({
                                gigs: []
                        });

                        await expect(useCase.execute(userId, role, 1, 10)).rejects.toThrow(GigNotFound);
                });

                it('should handle pagination for creator applications', async () => {
                        const mockGigs = Array.from({ length: 3 }, (_, i) => ({
                                id: `gig-${i + 1}`
                        }));

                        const mockApplications = Array.from({ length: 7 }, (_, i) => ({
                                id: `app-${i + 1}`,
                                getState: jest.fn().mockReturnValue({ id: `app-${i + 1}` })
                        }));

                        mockGigRepository.findByCreatorId.mockResolvedValue({
                                gigs: mockGigs as any
                        });
                        mockApplicationRepository.findByGigIds.mockResolvedValue({
                                applications: mockApplications as any,
                                total: 20
                        });

                        const result = await useCase.execute(userId, role, 2, 7);

                        expect(mockApplicationRepository.findByGigIds).toHaveBeenCalledWith(
                                ['gig-1', 'gig-2', 'gig-3'],
                                { skip: 7, take: 7 }
                        );
                        expect(result.page).toBe(2);
                        expect(result.totalPages).toBe(3);
                });

                it('should return empty list when no applications for creator gigs', async () => {
                        const mockGigs = [
                                {
                                        id: 'gig-1',
                                        creatorId: userId
                                }
                        ];

                        mockGigRepository.findByCreatorId.mockResolvedValue({
                                gigs: mockGigs as any
                        });
                        mockApplicationRepository.findByGigIds.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        const result = await useCase.execute(userId, role, 1, 10);

                        expect(result.applications).toEqual([]);
                        expect(result.total).toBe(0);
                });

                it('should extract correct gig IDs from creator gigs', async () => {
                        const mockGigs = [{ id: 'gig-100' }, { id: 'gig-200' }, { id: 'gig-300' }];

                        mockGigRepository.findByCreatorId.mockResolvedValue({
                                gigs: mockGigs as any
                        });
                        mockApplicationRepository.findByGigIds.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        await useCase.execute(userId, role, 1, 10);

                        expect(mockApplicationRepository.findByGigIds).toHaveBeenCalledWith(
                                ['gig-100', 'gig-200', 'gig-300'],
                                expect.any(Object)
                        );
                });
        });

        describe('Pagination calculation', () => {
                const userId = 'freelancer-123';

                it('should calculate correct skip for page 1', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        await useCase.execute(userId, 'FREELANCER', 1, 10);

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 0,
                                take: 10
                        });
                });

                it('should calculate correct skip for page 2', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        await useCase.execute(userId, 'FREELANCER', 2, 10);

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 10,
                                take: 10
                        });
                });

                it('should calculate correct skip for page 5 with limit 20', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        await useCase.execute(userId, 'FREELANCER', 5, 20);

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 80,
                                take: 20
                        });
                });

                it('should calculate correct total pages', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: Array.from({ length: 10 }, (_, i) => ({
                                        id: `app-${i}`,
                                        getState: jest.fn().mockReturnValue({ id: `app-${i}` })
                                })) as any,
                                total: 25
                        });

                        const result = await useCase.execute(userId, 'FREELANCER', 1, 10);

                        expect(result.totalPages).toBe(3); // Math.ceil(25 / 10)
                });

                it('should calculate total pages correctly for exact divisible total', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: Array.from({ length: 10 }, (_, i) => ({
                                        id: `app-${i}`,
                                        getState: jest.fn().mockReturnValue({ id: `app-${i}` })
                                })) as any,
                                total: 30
                        });

                        const result = await useCase.execute(userId, 'FREELANCER', 1, 10);

                        expect(result.totalPages).toBe(3); // 30 / 10 = 3
                });
        });

        describe('Response metadata', () => {
                const userId = 'freelancer-123';

                it('should include correct page in response', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        const result = await useCase.execute(userId, 'FREELANCER', 3, 10);

                        expect(result.page).toBe(3);
                });

                it('should include total in response', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 42
                        });

                        const result = await useCase.execute(userId, 'FREELANCER', 1, 10);

                        expect(result.total).toBe(42);
                });

                it('should include applications array in response', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [
                                        {
                                                id: 'app-1',
                                                getState: jest.fn().mockReturnValue({ id: 'app-1' })
                                        }
                                ] as any,
                                total: 1
                        });

                        const result = await useCase.execute(userId, 'FREELANCER', 1, 10);

                        expect(Array.isArray(result.applications)).toBe(true);
                });
        });

        describe('Default pagination parameters', () => {
                const userId = 'freelancer-123';

                it('should use default page 1 and limit 10 when not provided', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        await useCase.execute(userId, 'FREELANCER');

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 0,
                                take: 10
                        });
                });

                it('should use provided page when limit is default', async () => {
                        mockApplicationRepository.findByFreelancerId.mockResolvedValue({
                                applications: [],
                                total: 0
                        });

                        await useCase.execute(userId, 'FREELANCER', 2);

                        expect(mockApplicationRepository.findByFreelancerId).toHaveBeenCalledWith(userId, {
                                skip: 10,
                                take: 10
                        });
                });
        });
});
