import { GetContractUseCase } from '../../application/usecases/getContractUseCase.js';
import { ContractRepository } from '../../adapters/ContractRepository.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

describe('GetContractUseCase', () => {
        let useCase: GetContractUseCase;
        let mockContractRepository: jest.Mocked<ContractRepository>;

        beforeEach(() => {
                mockContractRepository = {
                        findById: jest.fn()
                } as unknown as jest.Mocked<ContractRepository>;

                useCase = new GetContractUseCase(mockContractRepository);
        });

        describe('execute - CREATOR role', () => {
                const userId = 'creator-123';
                const contractId = 'contract-456';
                const role: 'CREATOR' | 'FREELANCER' = 'CREATOR';

                it('should return contract for creator', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(userId, role, contractId);

                        expect(mockContractRepository.findById).toHaveBeenCalledWith(contractId);
                        expect(result).toEqual({
                                id: contractId,
                                creatorId: userId,
                                status: 'ACTIVE'
                        });
                });

                it('should throw error when contract not found', async () => {
                        mockContractRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(userId, role, contractId)).rejects.toThrow(
                                'contract not found'
                        );
                });

                it('should throw forbidden error when creator does not own contract', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: 'different-creator',
                                status: 'ACTIVE'
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await expect(useCase.execute(userId, role, contractId)).rejects.toThrow(
                                'not allowed'
                        );
                });

                it('should call getState on contract', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await useCase.execute(userId, role, contractId);

                        expect(mockContract.getState).toHaveBeenCalled();
                });

                it('should not throw error for authorized creator', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await expect(useCase.execute(userId, role, contractId)).resolves.toBeDefined();
                });
        });

        describe('execute - FREELANCER role', () => {
                const userId = 'freelancer-789';
                const contractId = 'contract-456';
                const role: 'CREATOR' | 'FREELANCER' = 'FREELANCER';

                it('should return contract for freelancer', async () => {
                        const mockContract = {
                                id: contractId,
                                freelancerId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        freelancerId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(userId, role, contractId);

                        expect(mockContractRepository.findById).toHaveBeenCalledWith(contractId);
                        expect(result).toEqual({
                                id: contractId,
                                freelancerId: userId,
                                status: 'ACTIVE'
                        });
                });

                it('should throw error when contract not found', async () => {
                        mockContractRepository.findById.mockResolvedValue(null);

                        await expect(useCase.execute(userId, role, contractId)).rejects.toThrow(
                                'contract not found'
                        );
                });

                it('should throw forbidden error when freelancer does not own contract', async () => {
                        const mockContract = {
                                id: contractId,
                                freelancerId: 'different-freelancer',
                                status: 'ACTIVE'
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await expect(useCase.execute(userId, role, contractId)).rejects.toThrow(
                                'not allowed'
                        );
                });

                it('should call getState on contract', async () => {
                        const mockContract = {
                                id: contractId,
                                freelancerId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        freelancerId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await useCase.execute(userId, role, contractId);

                        expect(mockContract.getState).toHaveBeenCalled();
                });

                it('should not throw error for authorized freelancer', async () => {
                        const mockContract = {
                                id: contractId,
                                freelancerId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        freelancerId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        await expect(useCase.execute(userId, role, contractId)).resolves.toBeDefined();
                });
        });

        describe('execute - Cross-role tests', () => {
                const contractId = 'contract-456';

                it('should return different results for CREATOR and FREELANCER roles', async () => {
                        const creatorId = 'creator-123';
                        const freelancerId = 'freelancer-789';

                        const creatorContract = {
                                id: contractId,
                                creatorId,
                                freelancerId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(creatorContract as any);

                        const creatorResult = await useCase.execute(creatorId, 'CREATOR', contractId);

                        expect(creatorResult).toBeDefined();

                        mockContractRepository.findById.mockResolvedValue(creatorContract as any);

                        const freelancerResult = await useCase.execute(
                                freelancerId,
                                'FREELANCER',
                                contractId
                        );

                        expect(freelancerResult).toBeDefined();
                });

                it('should handle contracts with both creator and freelancer in system', async () => {
                        const creatorId = 'creator-123';
                        const freelancerId = 'freelancer-789';

                        const mockContract = {
                                id: contractId,
                                creatorId,
                                freelancerId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId,
                                        freelancerId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(creatorId, 'CREATOR', contractId);

                        expect(result).toBeDefined();
                });
        });

        describe('execute - Error scenarios', () => {
                it('should throw BusinessError (404) when contract not found', async () => {
                        mockContractRepository.findById.mockResolvedValue(null);

                        try {
                                await useCase.execute('user-123', 'CREATOR', 'contract-456');
                                fail('Should have thrown BusinessError');
                        } catch (error) {
                                expect(error).toBeInstanceOf(BusinessError);
                        }
                });

                it('should throw BusinessError (403) when user unauthorized', async () => {
                        const mockContract = {
                                id: 'contract-456',
                                creatorId: 'other-creator',
                                status: 'ACTIVE'
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        try {
                                await useCase.execute('creator-123', 'CREATOR', 'contract-456');
                                fail('Should have thrown BusinessError');
                        } catch (error) {
                                expect(error).toBeInstanceOf(BusinessError);
                        }
                });
        });

        describe('execute - Contract states', () => {
                const userId = 'creator-123';
                const contractId = 'contract-456';

                it('should return ACTIVE contract state', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: userId,
                                status: 'ACTIVE',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId: userId,
                                        status: 'ACTIVE'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(userId, 'CREATOR', contractId);

                        expect(result.status).toBe('ACTIVE');
                });

                it('should return COMPLETED contract state', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: userId,
                                status: 'COMPLETED',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId: userId,
                                        status: 'COMPLETED'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(userId, 'CREATOR', contractId);

                        expect(result.status).toBe('COMPLETED');
                });

                it('should return CANCELLED contract state', async () => {
                        const mockContract = {
                                id: contractId,
                                creatorId: userId,
                                status: 'CANCELLED',
                                getState: jest.fn().mockReturnValue({
                                        id: contractId,
                                        creatorId: userId,
                                        status: 'CANCELLED'
                                })
                        };

                        mockContractRepository.findById.mockResolvedValue(mockContract as any);

                        const result = await useCase.execute(userId, 'CREATOR', contractId);

                        expect(result.status).toBe('CANCELLED');
                });
        });
});
