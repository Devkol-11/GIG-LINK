import { ReleaseEscrowUseCase } from '../../application/useCases/releaseEscrowUseCase.js';
import {
        EscrowNotFoundError,
        UnauthorizedAccessError,
        WalletNotFoundError
} from '../../domain/errors/domainErrors.js';
import { IEscrowAccountRepository } from '../../ports/IEscrowAccountRepository.js';
import { IEscrowAccountTransactionRepository } from '../../ports/IEscrowAccountTransaction.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';

describe('ReleaseEscrowUseCase', () => {
        let useCase: ReleaseEscrowUseCase;
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

                useCase = new ReleaseEscrowUseCase(
                        mockEscrowRepository,
                        mockEscrowTransactionRepository,
                        mockWalletRepository,
                        mockUnitOfWork
                );
        });

        describe('execute', () => {
                it('should release escrow successfully', async () => {
                        // Arrange
                        const escrowId = 'escrow-123';
                        const userId = 'creator-456';
                        const freelancerId = 'freelancer-789';

                        const mockEscrowAccount = {
                                id: escrowId,
                                creatorId: userId,
                                freeLancerId: freelancerId,
                                balance: 50000,
                                release: jest.fn().mockReturnValue(50000)
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                userId: freelancerId,
                                balance: 0,
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute(escrowId, userId);

                        // Assert
                        expect(mockEscrowRepository.findByid).toHaveBeenCalledWith(escrowId);
                        expect(mockEscrowAccount.release).toHaveBeenCalled();
                        expect(mockWallet.fund).toHaveBeenCalledWith(50000);
                });

                it('should throw EscrowNotFoundError when escrow not found', async () => {
                        // Arrange
                        mockEscrowRepository.findByid.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute('non-existent', 'user-456')).rejects.toThrow(
                                EscrowNotFoundError
                        );
                });

                it('should throw UnauthorizedAccessError when user is not creator', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'creator-123',
                                freeLancerId: 'freelancer-789'
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);

                        // Act & Assert
                        await expect(useCase.execute('escrow-123', 'wrong-user')).rejects.toThrow(
                                UnauthorizedAccessError
                        );
                });

                it('should throw WalletNotFoundError when freelancer wallet not found', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'creator-456',
                                freeLancerId: 'freelancer-789',
                                release: jest.fn().mockReturnValue(50000)
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute('escrow-123', 'creator-456')).rejects.toThrow(
                                WalletNotFoundError
                        );
                });

                it('should fund freelancer wallet with release amount', async () => {
                        // Arrange
                        const escrowId = 'escrow-123';
                        const userId = 'creator-456';
                        const freelancerId = 'freelancer-789';
                        const releaseAmount = 75000;

                        const mockEscrowAccount = {
                                id: escrowId,
                                creatorId: userId,
                                freeLancerId: freelancerId,
                                release: jest.fn().mockReturnValue(releaseAmount)
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                userId: freelancerId,
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute(escrowId, userId);

                        // Assert
                        expect(mockWallet.fund).toHaveBeenCalledWith(releaseAmount);
                });

                it('should execute transaction for wallet and transaction save', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'creator-456',
                                freeLancerId: 'freelancer-789',
                                release: jest.fn().mockReturnValue(50000)
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        const transactionSpy = jest.fn();
                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => {
                                transactionSpy();
                                await cb({} as any);
                        });

                        // Act
                        await useCase.execute('escrow-123', 'creator-456');

                        // Assert
                        expect(transactionSpy).toHaveBeenCalled();
                        expect(mockWalletRepository.save).toHaveBeenCalled();
                });

                it('should save escrow transaction in transaction', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'creator-456',
                                freeLancerId: 'freelancer-789',
                                release: jest.fn().mockReturnValue(50000)
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute('escrow-123', 'creator-456');

                        // Assert
                        expect(mockEscrowTransactionRepository.save).toHaveBeenCalled();
                });

                it('should create transaction with correct properties', async () => {
                        // Arrange
                        const mockEscrowAccount = {
                                id: 'escrow-123',
                                creatorId: 'creator-456',
                                freeLancerId: 'freelancer-789',
                                release: jest.fn().mockReturnValue(50000)
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockEscrowRepository.findByid.mockResolvedValue(mockEscrowAccount as any);
                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute('escrow-123', 'creator-456');

                        // Assert
                        expect(mockEscrowTransactionRepository.save).toHaveBeenCalled();
                });
        });
});
