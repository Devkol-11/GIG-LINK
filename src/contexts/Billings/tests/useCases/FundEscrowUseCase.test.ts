import { FundEscrowAccountUsecase } from '../../application/useCases/fundEscrowUseCase.js';
import {
        EscrowNotFoundError,
        InsufficientWalletBalanceError,
        UnauthorizedAccessError,
        WalletNotFoundError
} from '../../domain/errors/domainErrors.js';
import { IEscrowAccountRepository } from '../../ports/IEscrowAccountRepository.js';
import { IEscrowAccountTransactionRepository } from '../../ports/IEscrowAccountTransaction.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';

describe('FundEscrowAccountUsecase', () => {
        let useCase: FundEscrowAccountUsecase;
        let mockEscrowRepository: jest.Mocked<IEscrowAccountRepository>;
        let mockEscrowTransactionRepository: jest.Mocked<IEscrowAccountTransactionRepository>;
        let mockWalletRepository: jest.Mocked<IWalletRepository>;
        let mockUnitOfWork: jest.Mocked<IUnitOfWork>;

        beforeEach(() => {
                mockEscrowRepository = {
                        save: jest.fn(),
                        findByid: jest.fn()
                } as any;

                mockEscrowTransactionRepository = {
                        save: jest.fn(),
                        findById: jest.fn()
                } as any;

                mockWalletRepository = {
                        findByUserId: jest.fn(),
                        save: jest.fn(),
                        findById: jest.fn()
                } as any;

                mockUnitOfWork = {
                        transaction: jest.fn()
                } as any;

                useCase = new FundEscrowAccountUsecase(
                        mockEscrowRepository,
                        mockEscrowTransactionRepository,
                        mockWalletRepository,
                        mockUnitOfWork
                );
        });

        describe('execute', () => {
                it('should fund escrow account successfully', async () => {
                        // Arrange
                        const escrowId = 'escrow-123';
                        const amount = 50000;
                        const userId = 'user-456';

                        const mockEscrowAccount = {
                                id: escrowId,
                                creatorId: userId,
                                freeLancerId: 'freelancer-789',
                                balance: 0,
                                fund: jest.fn(),
                                getState: jest.fn().mockReturnValue({
                                        id: escrowId,
                                        creatorId: userId,
                                        balance: amount
                                })
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                userId,
                                availableAmount: 100000,
                                checkBalance: jest.fn(),
                                debit: jest.fn(),
                                getState: jest.fn().mockReturnValue({
                                        id: 'wallet-123',
                                        availableAmount: 50000
                                })
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(escrowId, amount, userId);

                        // Assert
                        expect(mockEscrowRepository.findByid).toHaveBeenCalledWith(escrowId);
                        expect(mockWalletRepository.findByUserId).toHaveBeenCalledWith(userId);
                        expect(mockWallet.debit).toHaveBeenCalledWith(amount);
                        expect(mockEscrowAccount.fund).toHaveBeenCalledWith(amount);
                        expect(result.message).toBe('escrow funded successfully');
                });

                it('should throw EscrowNotFoundError when escrow not found', async () => {
                        // Arrange
                        mockEscrowRepository.findByid.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute('non-existent', 50000, 'user-456')).rejects.toThrow(
                                EscrowNotFoundError
                        );

                        expect(mockEscrowRepository.findByid).toHaveBeenCalled();
                });

                it('should throw UnauthorizedAccessError when userId does not match creatorId', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'creator-123',
                                freeLancerId: 'freelancer-789'
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);

                        // Act & Assert
                        await expect(useCase.execute('escrow-123', 50000, 'wrong-user')).rejects.toThrow(
                                UnauthorizedAccessError
                        );
                });

                it('should throw WalletNotFoundError when wallet not found', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'user-456',
                                freeLancerId: 'freelancer-789'
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute('escrow-123', 50000, 'user-456')).rejects.toThrow(
                                WalletNotFoundError
                        );
                });

                it('should throw InsufficientWalletBalanceError when balance is insufficient', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'user-456',
                                freeLancerId: 'freelancer-789'
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                availableAmount: 10000,
                                checkBalance: jest.fn()
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);

                        // Act & Assert
                        await expect(useCase.execute('escrow-123', 50000, 'user-456')).rejects.toThrow(
                                InsufficientWalletBalanceError
                        );
                });

                it('should execute transaction with correct parameters', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'user-456',
                                freeLancerId: 'freelancer-789',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                userId: 'user-456',
                                availableAmount: 100000,
                                checkBalance: jest.fn(),
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        const transactionMock = jest.fn();
                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => {
                                transactionMock();
                                await cb({} as any);
                        });

                        // Act
                        await useCase.execute('escrow-123', 50000, 'user-456');

                        // Assert
                        expect(transactionMock).toHaveBeenCalled();
                        expect(mockUnitOfWork.transaction).toHaveBeenCalled();
                });

                it('should save wallet and escrow account in transaction', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'user-456',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                availableAmount: 100000,
                                checkBalance: jest.fn(),
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute('escrow-123', 50000, 'user-456');

                        // Assert
                        expect(mockWalletRepository.save).toHaveBeenCalled();
                        expect(mockEscrowRepository.save).toHaveBeenCalled();
                });
        });
});
