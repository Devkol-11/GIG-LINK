import { CompleteContractUseCase } from '../../application/usecases/completeContractUseCase.js';
import { ContractRepository } from '../../adapters/ContractRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import { ContractNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';

describe('CompleteContractUseCase', () => {
        let useCase: CompleteContractUseCase;
        let mockContractRepository: jest.Mocked<ContractRepository>;

        beforeEach(() => {
                mockContractRepository = {
                        findById: jest.fn(),
                        save: jest.fn()
                } as unknown as jest.Mocked<ContractRepository>;

                useCase = new CompleteContractUseCase(mockContractRepository);
        });

        describe('execute', () => {
                it('should successfully complete a contract', async () => {
                        const creatorId = 'creator-123';
                        const contractId = 'contract-456';

                        const mockContract = {
                                id: contractId,
                                creatorId,
                                status: 'ACTIVE',
                                markAsCompleted: jest.fn(),
                                updateEndDate: jest.fn(),
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        status: 'COMPLETED',
                                        endDate: expect.any(Date)
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);
                        mockContractRepository.save.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(creatorId, contractId);

                        expect(mockContractRepository.findById).toHaveBeenCalledWith(contractId);
                        expect(mockContract.markAsCompleted).toHaveBeenCalled();
                        expect(mockContract.updateEndDate).toHaveBeenCalled();
                        expect(mockContractRepository.save).toHaveBeenCalledWith(mockContract);
                        expect(result).toEqual({ message: 'Contract completion successful' });
                });

                it('should throw ContractNotFound when contract does not exist', async () => {
                        const creatorId = 'creator-123';
                        const contractId = 'non-existent-contract';

                        mockContractRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(creatorId, contractId)).rejects.toThrow(
                                ContractNotFound
                        );
                        expect(mockContractRepository.findById).toHaveBeenCalledWith(contractId);
                });

                it('should throw NotAllowed when creatorId does not match contract creator', async () => {
                        const creatorId = 'unauthorized-creator';
                        const contractId = 'contract-456';
                        const actualCreatorId = 'actual-creator';

                        const mockContract = {
                                id: contractId,
                                creatorId: actualCreatorId
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await expect(useCase.execute(creatorId, contractId)).rejects.toThrow(NotAllowed);
                        expect(mockContractRepository.findById).toHaveBeenCalledWith(contractId);
                });

                it('should not call save if contract does not belong to creator', async () => {
                        const creatorId = 'unauthorized-creator';
                        const contractId = 'contract-456';

                        const mockContract = {
                                id: contractId,
                                creatorId: 'different-creator'
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        try {
                                await useCase.execute(creatorId, contractId);
                        } catch (error) {
                                // expected
                        }

                        expect(mockContractRepository.save).not.toHaveBeenCalled();
                });

                it('should call markAsCompleted on the contract', async () => {
                        const creatorId = 'creator-123';
                        const contractId = 'contract-456';

                        const mockContract = {
                                id: contractId,
                                creatorId,
                                markAsCompleted: jest.fn(),
                                updateEndDate: jest.fn()
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);
                        mockContractRepository.save.mockResolvedValue(mockContract as any);

                        await useCase.execute(creatorId, contractId);

                        expect(mockContract.markAsCompleted).toHaveBeenCalled();
                });

                it('should call updateEndDate on the contract', async () => {
                        const creatorId = 'creator-123';
                        const contractId = 'contract-456';

                        const mockContract = {
                                id: contractId,
                                creatorId,
                                markAsCompleted: jest.fn(),
                                updateEndDate: jest.fn()
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);
                        mockContractRepository.save.mockResolvedValue(mockContract as any);

                        await useCase.execute(creatorId, contractId);

                        expect(mockContract.updateEndDate).toHaveBeenCalled();
                });

                it('should persist updated contract to repository', async () => {
                        const creatorId = 'creator-123';
                        const contractId = 'contract-456';

                        const mockContract = {
                                id: contractId,
                                creatorId,
                                status: 'ACTIVE',
                                markAsCompleted: jest.fn(),
                                updateEndDate: jest.fn()
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);
                        mockContractRepository.save.mockResolvedValue(mockContract as any);

                        await useCase.execute(creatorId, contractId);

                        expect(mockContractRepository.save).toHaveBeenCalledWith(mockContract);
                });
        });
});
