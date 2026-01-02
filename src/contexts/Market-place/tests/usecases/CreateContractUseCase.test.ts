import { CreateContractUseCase } from '../../application/usecases/createContractUsecase.js';
import { IContractRepository } from '../../ports/IContractRepository.js';
import { IApplicationRepository } from '../../ports/IApplicationRepository.js';
import { IGigRepository } from '../../ports/IGigRepository.js';
import { IEventBus } from '../../ports/IEventBus.js';
import {
	ApplicationNotFound,
	GigNotFound,
	NotAllowed,
	ApplicationConflict,
} from '../../domain/errors/DomainErrors.js';

describe('CreateContractUseCase', () => {
	let useCase: CreateContractUseCase;
	let mockContractRepository: jest.Mocked<IContractRepository>;
	let mockApplicationRepository: jest.Mocked<IApplicationRepository>;
	let mockGigRepository: jest.Mocked<IGigRepository>;
	let mockEventBus: jest.Mocked<IEventBus>;

	beforeEach(() => {
		mockContractRepository = {
			save: jest.fn(),
		} as unknown as jest.Mocked<IContractRepository>;

		mockApplicationRepository = {
			findById: jest.fn(),
		} as unknown as jest.Mocked<IApplicationRepository>;

		mockGigRepository = {
			findById: jest.fn(),
		} as unknown as jest.Mocked<IGigRepository>;

		mockEventBus = {
			publish: jest.fn(),
		} as unknown as jest.Mocked<IEventBus>;

		useCase = new CreateContractUseCase(
			mockContractRepository,
			mockApplicationRepository,
			mockGigRepository,
			mockEventBus
		);
	});

	describe('execute', () => {
		const applicationId = 'app-123';
		const creatorId = 'creator-456';

		it('should successfully create a contract', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				freelancerId: 'freelancer-101',
				creatorId,
				status: 'ACCEPTED',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
				price: 50000,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);
			mockContractRepository.save.mockResolvedValue({} as any);
			mockEventBus.publish.mockResolvedValue(undefined);

			const result = await useCase.execute(applicationId, creatorId);

			expect(mockApplicationRepository.findById).toHaveBeenCalledWith(
				applicationId
			);
			expect(mockGigRepository.findById).toHaveBeenCalledWith(mockGig.id);
			expect(result).toEqual({ message: 'contract created' });
		});

		it('should throw ApplicationNotFound when application does not exist', async () => {
			mockApplicationRepository.findById.mockResolvedValue(null);

			await expect(useCase.execute(applicationId, creatorId)).rejects.toThrow(
				ApplicationNotFound
			);
		});

		it('should throw GigNotFound when gig does not exist', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(null);

			await expect(useCase.execute(applicationId, creatorId)).rejects.toThrow(
				GigNotFound
			);
		});

		it('should throw NotAllowed when creatorId does not match gig creator', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId: 'different-creator',
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);

			await expect(useCase.execute(applicationId, creatorId)).rejects.toThrow(
				NotAllowed
			);
		});

		it('should throw ApplicationConflict when application status is not ACCEPTED', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				status: 'PENDING',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);

			await expect(useCase.execute(applicationId, creatorId)).rejects.toThrow(
				ApplicationConflict
			);
		});

		it('should save contract to repository', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				freelancerId: 'freelancer-101',
				status: 'ACCEPTED',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
				price: 50000,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);
			mockContractRepository.save.mockResolvedValue({} as any);
			mockEventBus.publish.mockResolvedValue(undefined);

			await useCase.execute(applicationId, creatorId);

			expect(mockContractRepository.save).toHaveBeenCalled();
			const savedContract = mockContractRepository.save.mock.calls[0][0];
			expect(savedContract).toBeDefined();
		});

		it('should publish ContractCreatedEvent', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				freelancerId: 'freelancer-101',
				creatorId,
				status: 'ACCEPTED',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
				price: 50000,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);
			mockContractRepository.save.mockResolvedValue({} as any);
			mockEventBus.publish.mockResolvedValue(undefined);

			await useCase.execute(applicationId, creatorId);

			expect(mockEventBus.publish).toHaveBeenCalledWith(
				'contract:created',
				expect.any(Object)
			);
		});

		it('should create contract with correct properties', async () => {
			const freelancerId = 'freelancer-101';
			const gigId = 'gig-789';
			const price = 50000;

			const mockApplication = {
				id: applicationId,
				gigId,
				freelancerId,
				status: 'ACCEPTED',
			};

			const mockGig = {
				id: gigId,
				creatorId,
				price,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);
			mockContractRepository.save.mockResolvedValue({} as any);
			mockEventBus.publish.mockResolvedValue(undefined);

			await useCase.execute(applicationId, creatorId);

			const savedContract = mockContractRepository.save.mock.calls[0][0];
			expect(savedContract).toMatchObject({
				gigId,
				freelancerId,
				creatorId,
				amountKobo: price,
				currency: 'NGN',
			});
		});

		it('should use gig price as contract amount', async () => {
			const gigPrice = 100000;
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				freelancerId: 'freelancer-101',
				status: 'ACCEPTED',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
				price: gigPrice,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);
			mockContractRepository.save.mockResolvedValue({} as any);
			mockEventBus.publish.mockResolvedValue(undefined);

			await useCase.execute(applicationId, creatorId);

			const savedContract = mockContractRepository.save.mock.calls[0][0];
			expect(savedContract.amountKobo).toBe(gigPrice);
		});

		it('should set contract currency to NGN', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				freelancerId: 'freelancer-101',
				status: 'ACCEPTED',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
				price: 50000,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);
			mockContractRepository.save.mockResolvedValue({} as any);
			mockEventBus.publish.mockResolvedValue(undefined);

			await useCase.execute(applicationId, creatorId);

			const savedContract = mockContractRepository.save.mock.calls[0][0];
			expect(savedContract.currency).toBe('NGN');
		});

		it('should not save contract if application is not accepted', async () => {
			const mockApplication = {
				id: applicationId,
				gigId: 'gig-789',
				status: 'REJECTED',
			};

			const mockGig = {
				id: 'gig-789',
				creatorId,
			};

			mockApplicationRepository.findById.mockResolvedValue(
				mockApplication as any
			);
			mockGigRepository.findById.mockResolvedValue(mockGig as any);

			try {
				await useCase.execute(applicationId, creatorId);
			} catch (error) {
				// expected
			}

			expect(mockContractRepository.save).not.toHaveBeenCalled();
		});
	});
});
