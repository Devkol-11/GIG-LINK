import { ListContractsUseCase } from '../../application/usecases/listContractsUseCase.js';
import { ContractRepository } from '../../adapters/ContractRepository.js';
import { ContractNotFound } from '../../domain/errors/DomainErrors.js';

describe('ListContractsUseCase', () => {
        let useCase: ListContractsUseCase;
        let mockContractRepository: jest.Mocked<ContractRepository>;

        beforeEach(() => {
                mockContractRepository = {
                        findByCreatorId: jest.fn(),
                        findByFreeLancerId: jest.fn()
                } as unknown as jest.Mocked<ContractRepository>;

                useCase = new ListContractsUseCase(mockContractRepository);
        });

        describe('execute - CREATOR role', () => {
                const userId = 'creator-123';
                const role: 'CREATOR' | 'FREELANCER' = 'CREATOR';

                it('should return all contracts for creator', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        creatorId: userId,
                                        status: 'ACTIVE',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                creatorId: userId,
                                                status: 'ACTIVE'
                                        })
                                },
                                {
                                        id: 'contract-2',
                                        creatorId: userId,
                                        status: 'COMPLETED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-2',
                                                creatorId: userId,
                                                status: 'COMPLETED'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, role);

                        expect(mockContractRepository.findByCreatorId).toHaveBeenCalledWith(userId);
                        expect(result).toHaveLength(2);
                        expect(result[0]).toEqual({
                                id: 'contract-1',
                                creatorId: userId,
                                status: 'ACTIVE'
                        });
                });

                it('should throw ContractNotFound when creator has no contracts', async () => {
                        mockContractRepository.findByCreatorId.mockResolvedValue(null);

                        await expect(useCase.execute(userId, role)).rejects.toThrow(ContractNotFound);
                });

                it('should throw ContractNotFound when creator has empty contract list', async () => {
                        mockContractRepository.findByCreatorId.mockResolvedValue([]);

                        await expect(useCase.execute(userId, role)).rejects.toThrow(
                                'You do not have any contracts at the moment'
                        );
                });

                it('should call getState on each contract', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1'
                                        })
                                },
                                {
                                        id: 'contract-2',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-2'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        await useCase.execute(userId, role);

                        mockContracts.forEach((contract) => {
                                expect(contract.getState).toHaveBeenCalled();
                        });
                });

                it('should handle single contract for creator', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        creatorId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                creatorId: userId
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, role);

                        expect(result).toHaveLength(1);
                        expect(result[0]).toEqual({
                                id: 'contract-1',
                                creatorId: userId
                        });
                });

                it('should handle multiple contracts for creator', async () => {
                        const mockContracts = Array.from({ length: 10 }, (_, i) => ({
                                id: `contract-${i + 1}`,
                                getState: jest.fn().mockReturnValue({
                                        id: `contract-${i + 1}`
                                })
                        }));

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, role);

                        expect(result).toHaveLength(10);
                });
        });

        describe('execute - FREELANCER role', () => {
                const userId = 'freelancer-456';
                const role: 'CREATOR' | 'FREELANCER' = 'FREELANCER';

                it('should return all contracts for freelancer', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        freelancerId: userId,
                                        status: 'ACTIVE',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                freelancerId: userId,
                                                status: 'ACTIVE'
                                        })
                                },
                                {
                                        id: 'contract-2',
                                        freelancerId: userId,
                                        status: 'COMPLETED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-2',
                                                freelancerId: userId,
                                                status: 'COMPLETED'
                                        })
                                }
                        ];

                        mockContractRepository.findByFreeLancerId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, role);

                        expect(mockContractRepository.findByFreeLancerId).toHaveBeenCalledWith(userId);
                        expect(result).toHaveLength(2);
                        expect(result[0]).toEqual({
                                id: 'contract-1',
                                freelancerId: userId,
                                status: 'ACTIVE'
                        });
                });

                it('should throw ContractNotFound when freelancer has no contracts', async () => {
                        mockContractRepository.findByFreeLancerId.mockResolvedValue(null);

                        await expect(useCase.execute(userId, role)).rejects.toThrow(ContractNotFound);
                });

                it('should throw ContractNotFound when freelancer has empty contract list', async () => {
                        mockContractRepository.findByFreeLancerId.mockResolvedValue([]);

                        await expect(useCase.execute(userId, role)).rejects.toThrow(
                                'You do not have any contracts at the moment'
                        );
                });

                it('should call getState on each contract', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1'
                                        })
                                },
                                {
                                        id: 'contract-2',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-2'
                                        })
                                }
                        ];

                        mockContractRepository.findByFreeLancerId.mockResolvedValue(mockContracts as any);

                        await useCase.execute(userId, role);

                        mockContracts.forEach((contract) => {
                                expect(contract.getState).toHaveBeenCalled();
                        });
                });

                it('should handle single contract for freelancer', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        freelancerId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                freelancerId: userId
                                        })
                                }
                        ];

                        mockContractRepository.findByFreeLancerId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, role);

                        expect(result).toHaveLength(1);
                });

                it('should handle multiple contracts for freelancer', async () => {
                        const mockContracts = Array.from({ length: 10 }, (_, i) => ({
                                id: `contract-${i + 1}`,
                                getState: jest.fn().mockReturnValue({
                                        id: `contract-${i + 1}`
                                })
                        }));

                        mockContractRepository.findByFreeLancerId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, role);

                        expect(result).toHaveLength(10);
                });
        });

        describe('execute - Contract states', () => {
                const userId = 'user-123';

                it('should return contracts with ACTIVE status', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        status: 'ACTIVE',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                status: 'ACTIVE'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, 'CREATOR');

                        expect(result[0].status).toBe('ACTIVE');
                });

                it('should return contracts with COMPLETED status', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        status: 'COMPLETED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                status: 'COMPLETED'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, 'CREATOR');

                        expect(result[0].status).toBe('COMPLETED');
                });

                it('should return contracts with CANCELLED status', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        status: 'CANCELLED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                status: 'CANCELLED'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, 'CREATOR');

                        expect(result[0].status).toBe('CANCELLED');
                });

                it('should return contracts with mixed statuses', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        status: 'ACTIVE',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                status: 'ACTIVE'
                                        })
                                },
                                {
                                        id: 'contract-2',
                                        status: 'COMPLETED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-2',
                                                status: 'COMPLETED'
                                        })
                                },
                                {
                                        id: 'contract-3',
                                        status: 'CANCELLED',
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-3',
                                                status: 'CANCELLED'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, 'CREATOR');

                        expect(result).toHaveLength(3);
                        expect(result[0].status).toBe('ACTIVE');
                        expect(result[1].status).toBe('COMPLETED');
                        expect(result[2].status).toBe('CANCELLED');
                });
        });

        describe('execute - Error handling', () => {
                const userId = 'user-123';

                it('should throw error with meaningful message', async () => {
                        mockContractRepository.findByCreatorId.mockResolvedValue(null);

                        try {
                                await useCase.execute(userId, 'CREATOR');
                                fail('Should have thrown ContractNotFound');
                        } catch (error) {
                                expect(error).toBeInstanceOf(ContractNotFound);
                        }
                });

                it('should handle different user IDs', async () => {
                        const userIds = ['user-1', 'user-2', 'user-3'];

                        for (const id of userIds) {
                                mockContractRepository.findByCreatorId.mockClear();
                                mockContractRepository.findByCreatorId.mockResolvedValue([
                                        {
                                                id: 'contract-1',
                                                getState: jest.fn().mockReturnValue({
                                                        id: 'contract-1'
                                                })
                                        }
                                ] as any);

                                const result = await useCase.execute(id, 'CREATOR');

                                expect(mockContractRepository.findByCreatorId).toHaveBeenCalledWith(id);
                                expect(result).toHaveLength(1);
                        }
                });
        });

        describe('execute - Response format', () => {
                const userId = 'user-123';

                it('should return array of contract states', async () => {
                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        creatorId: userId,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'contract-1',
                                                creatorId: userId,
                                                status: 'ACTIVE'
                                        })
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, 'CREATOR');

                        expect(Array.isArray(result)).toBe(true);
                        expect(result[0]).toHaveProperty('id');
                });

                it('should preserve all properties from getState', async () => {
                        const stateData = {
                                id: 'contract-1',
                                creatorId: userId,
                                freelancerId: 'freelancer-456',
                                status: 'ACTIVE',
                                amountKobo: 50000,
                                currency: 'NGN',
                                startDate: new Date(),
                                endDate: null,
                                paymentStatus: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockContracts = [
                                {
                                        id: 'contract-1',
                                        getState: jest.fn().mockReturnValue(stateData)
                                }
                        ];

                        mockContractRepository.findByCreatorId.mockResolvedValue(mockContracts as any);

                        const result = await useCase.execute(userId, 'CREATOR');

                        expect(result[0]).toEqual(stateData);
                });
        });
});
