import { UpdateApplicationUseCase } from '../../application/usecases/updateApplicationStatusUseCase.js';
import { ApplicationRepository } from '../../adapters/ApplicationRepository.js';
import { ApplicationNotFound, NotAllowed, ApplicationConflict } from '../../domain/errors/DomainErrors.js';
import { ApplicationStatus } from '../../domain/enums/DomainEnums.js';

describe('UpdateApplicationUseCase', () => {
        let useCase: UpdateApplicationUseCase;
        let mockApplicationRepository: jest.Mocked<ApplicationRepository>;

        beforeEach(() => {
                mockApplicationRepository = {
                        findById: jest.fn(),
                        save: jest.fn()
                } as unknown as jest.Mocked<ApplicationRepository>;

                useCase = new UpdateApplicationUseCase(mockApplicationRepository);
        });

        describe('execute', () => {
                const applicationId = 'app-123';

                it('should throw ApplicationNotFound when application does not exist', async () => {
                        mockApplicationRepository.findById.mockResolvedValue(null);

                        await expect(
                                useCase.execute(applicationId, { status: 'ACCEPTED' }, 'CREATOR')
                        ).rejects.toThrow(ApplicationNotFound);
                });

                it('should not allow FREELANCER to update status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING'
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);

                        await expect(
                                useCase.execute(applicationId, { status: 'ACCEPTED' }, 'FREELANCER')
                        ).rejects.toThrow(NotAllowed);
                });

                it('should not allow CREATOR to update cover letter', async () => {
                        const mockApplication = {
                                id: applicationId,
                                coverLetter: 'Initial letter'
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);

                        await expect(
                                useCase.execute(applicationId, { coverLetter: 'Updated letter' }, 'CREATOR')
                        ).rejects.toThrow(NotAllowed);
                });

                it('should not allow FREELANCER to update status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING'
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);

                        await expect(
                                useCase.execute(applicationId, { status: 'ACCEPTED' }, 'FREELANCER')
                        ).rejects.toThrow(NotAllowed);
                });

                it('should throw ApplicationConflict for invalid status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING',
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);

                        await expect(
                                useCase.execute(applicationId, { status: 'INVALID_STATUS' }, 'CREATOR')
                        ).rejects.toThrow(ApplicationConflict);
                });

                it('should accept valid status updates from CREATOR', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING',
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        await useCase.execute(applicationId, { status: 'ACCEPTED' }, 'CREATOR');

                        expect(mockApplication.updateStatus).toHaveBeenCalledWith('ACCEPTED');
                        expect(mockApplicationRepository.save).toHaveBeenCalledWith(mockApplication);
                });

                it('should allow FREELANCER to update cover letter', async () => {
                        const newCoverLetter = 'Updated cover letter';
                        const mockApplication = {
                                id: applicationId,
                                coverLetter: 'Initial letter',
                                updateCoverLetter: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        await useCase.execute(applicationId, { coverLetter: newCoverLetter }, 'FREELANCER');

                        expect(mockApplication.updateCoverLetter).toHaveBeenCalledWith(newCoverLetter);
                        expect(mockApplicationRepository.save).toHaveBeenCalledWith(mockApplication);
                });

                it('should allow CREATOR to update status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING',
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        const statuses = ['PENDING', 'ACCEPTED', 'REJECTED'];

                        for (const status of statuses) {
                                mockApplication.updateStatus.mockClear();
                                mockApplicationRepository.save.mockClear();

                                await useCase.execute(applicationId, { status }, 'CREATOR');

                                expect(mockApplication.updateStatus).toHaveBeenCalledWith(status);
                        }
                });

                it('should save application after status update', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING',
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        await useCase.execute(applicationId, { status: 'ACCEPTED' }, 'CREATOR');

                        expect(mockApplicationRepository.save).toHaveBeenCalledWith(mockApplication);
                });

                it('should save application after cover letter update', async () => {
                        const mockApplication = {
                                id: applicationId,
                                coverLetter: 'Initial',
                                updateCoverLetter: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        await useCase.execute(applicationId, { coverLetter: 'Updated' }, 'FREELANCER');

                        expect(mockApplicationRepository.save).toHaveBeenCalledWith(mockApplication);
                });

                it('should validate status against enum values', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING'
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);

                        const invalidStatuses = ['UNKNOWN', 'PROCESSING', 'DONE', 'FAILURE', ''];

                        for (const status of invalidStatuses) {
                                await expect(
                                        useCase.execute(applicationId, { status }, 'CREATOR')
                                ).rejects.toThrow(ApplicationConflict);
                        }
                });

                it('should handle updating both properties when allowed by role (status)', async () => {
                        const mockApplication = {
                                id: applicationId,
                                status: 'PENDING',
                                coverLetter: 'Initial',
                                updateStatus: jest.fn(),
                                updateCoverLetter: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        // Creator can update status, but attempting cover letter should throw
                        await expect(
                                useCase.execute(
                                        applicationId,
                                        { status: 'ACCEPTED', coverLetter: 'New letter' },
                                        'CREATOR'
                                )
                        ).rejects.toThrow(NotAllowed);
                });
        });

        describe('Status validation', () => {
                const applicationId = 'app-123';

                const validStatuses = Object.values(ApplicationStatus);

                it('should accept all valid statuses', async () => {
                        const mockApplication = {
                                id: applicationId,
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        for (const status of validStatuses) {
                                mockApplication.updateStatus.mockClear();

                                await useCase.execute(applicationId, { status }, 'CREATOR');

                                expect(mockApplication.updateStatus).toHaveBeenCalledWith(status);
                        }
                });

                it('should reject invalid statuses', async () => {
                        const mockApplication = {
                                id: applicationId
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);

                        const invalidStatuses = ['PROCESSING', 'COMPLETED', 'ARCHIVED', 'NEW'];

                        for (const status of invalidStatuses) {
                                await expect(
                                        useCase.execute(applicationId, { status }, 'CREATOR')
                                ).rejects.toThrow(ApplicationConflict);
                        }
                });
        });

        describe('Role-based access control', () => {
                const applicationId = 'app-123';

                it('CREATOR can update status but not cover letter', async () => {
                        const mockApplication = {
                                id: applicationId,
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        // Can update status
                        await useCase.execute(applicationId, { status: 'ACCEPTED' }, 'CREATOR');
                        expect(mockApplication.updateStatus).toHaveBeenCalled();

                        // Cannot update cover letter
                        await expect(
                                useCase.execute(applicationId, { coverLetter: 'New letter' }, 'CREATOR')
                        ).rejects.toThrow(NotAllowed);
                });

                it('FREELANCER can update cover letter but not status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                updateCoverLetter: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        // Can update cover letter
                        await useCase.execute(applicationId, { coverLetter: 'New letter' }, 'FREELANCER');
                        expect(mockApplication.updateCoverLetter).toHaveBeenCalled();

                        // Cannot update status
                        mockApplication.updateCoverLetter.mockClear();
                        await expect(
                                useCase.execute(applicationId, { status: 'ACCEPTED' }, 'FREELANCER')
                        ).rejects.toThrow(NotAllowed);
                });
        });

        describe('ApplicationAcceptedEvent handling', () => {
                const applicationId = 'app-123';

                it('should handle ACCEPTED status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                freelancerId: 'freelancer-456',
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        await useCase.execute(applicationId, { status: 'ACCEPTED' }, 'CREATOR');

                        expect(mockApplication.updateStatus).toHaveBeenCalledWith('ACCEPTED');
                });
        });

        describe('Partial updates', () => {
                const applicationId = 'app-123';

                it('should handle partial updates with only status', async () => {
                        const mockApplication = {
                                id: applicationId,
                                updateStatus: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        const result = await useCase.execute(
                                applicationId,
                                { status: 'ACCEPTED' },
                                'CREATOR'
                        );

                        expect(mockApplication.updateStatus).toHaveBeenCalledWith('ACCEPTED');
                        expect(result).toBeDefined();
                });

                it('should handle partial updates with only cover letter', async () => {
                        const mockApplication = {
                                id: applicationId,
                                updateCoverLetter: jest.fn()
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        const result = await useCase.execute(
                                applicationId,
                                { coverLetter: 'Updated letter' },
                                'FREELANCER'
                        );

                        expect(mockApplication.updateCoverLetter).toHaveBeenCalledWith('Updated letter');
                        expect(result).toBeDefined();
                });

                it('should handle empty updates', async () => {
                        const mockApplication = {
                                id: applicationId
                        };

                        mockApplicationRepository.findById.mockResolvedValue(mockApplication as any);
                        mockApplicationRepository.save.mockResolvedValue(mockApplication as any);

                        const result = await useCase.execute(applicationId, {}, 'CREATOR');

                        expect(result).toBeDefined();
                        expect(mockApplicationRepository.save).toHaveBeenCalledWith(mockApplication);
                });
        });
});
