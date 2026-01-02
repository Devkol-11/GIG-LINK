import { VerifyWithdrawalWebhookUseCase } from '../../application/useCases/verifyWithdrawalWebhookUseCase.js';
import { PaymentNotFoundError, WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { WithdrawalWebhookCommand } from '../../application/dtos/WithdrawalDTO.js';

describe('VerifyWithdrawalWebhookUseCase', () => {
        let useCase: VerifyWithdrawalWebhookUseCase;
        let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
        let mockWalletRepository: jest.Mocked<IWalletRepository>;
        let mockUnitOfWork: jest.Mocked<IUnitOfWork>;

        beforeEach(() => {
                mockPaymentRepository = {
                        save: jest.fn(),
                        findById: jest.fn(),
                        findByProviderReference: jest.fn(),
                        findBySystemReference: jest.fn(),
                        findAllByWalletId: jest.fn()
                } as any;

                mockWalletRepository = {
                        findById: jest.fn(),
                        findByUserId: jest.fn(),
                        save: jest.fn()
                } as any;

                mockUnitOfWork = {
                        transaction: jest.fn()
                } as any;

                useCase = new VerifyWithdrawalWebhookUseCase(
                        mockPaymentRepository,
                        mockWalletRepository,
                        mockUnitOfWork
                );
        });

        describe('execute', () => {
                it('should handle transfer.success event', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                markAsSuccess: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('success');
                        expect(mockPayment.markAsSuccess).toHaveBeenCalled();
                });

                it('should handle transfer.reversed event', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.reversed',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 50000,
                                markAsReversed: jest.fn()
                        };

                        const mockWallet = {
                                id: 'wallet-789',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('reversed');
                        expect(mockPayment.markAsReversed).toHaveBeenCalled();
                        expect(mockWallet.fund).toHaveBeenCalledWith(50000);
                });

                it('should handle transfer.failed event', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.failed',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 75000,
                                markAsFailed: jest.fn()
                        };

                        const mockWallet = {
                                id: 'wallet-789',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('failed');
                        expect(mockPayment.markAsFailed).toHaveBeenCalled();
                        expect(mockWallet.fund).toHaveBeenCalledWith(75000);
                });

                it('should throw PaymentNotFoundError when payment not found', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.success',
                                data: {
                                        reference: 'non-existent'
                                }
                        } as any;

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute(webhookEvent)).rejects.toThrow(PaymentNotFoundError);
                });

                it('should throw WalletNotFoundError when wallet not found for reversed transfer', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.reversed',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789'
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute(webhookEvent)).rejects.toThrow(WalletNotFoundError);
                });

                it('should handle idempotent transfer.success event', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                status: 'SUCCESS'
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('already processed');
                        expect(mockPaymentRepository.save).not.toHaveBeenCalled();
                });

                it('should ignore unknown events', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'unknown.event',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                status: 'PENDING'
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('ignored');
                        expect(mockPaymentRepository.save).not.toHaveBeenCalled();
                });

                it('should save payment in transaction for transfer.success', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                markAsSuccess: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute(webhookEvent);

                        // Assert
                        expect(mockUnitOfWork.transaction).toHaveBeenCalled();
                        expect(mockPaymentRepository.save).toHaveBeenCalled();
                });

                it('should refund wallet and save payment for transfer.reversed', async () => {
                        // Arrange
                        const webhookEvent: WithdrawalWebhookCommand = {
                                event: 'transfer.reversed',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 100000,
                                markAsReversed: jest.fn()
                        };

                        const mockWallet = {
                                id: 'wallet-789',
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute(webhookEvent);

                        // Assert
                        expect(mockWallet.fund).toHaveBeenCalledWith(100000);
                        expect(mockWalletRepository.save).toHaveBeenCalled();
                });

                it('should handle multiple different withdrawal webhook events', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 50000,
                                markAsSuccess: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act - First call
                        const result1 = await useCase.execute({
                                event: 'transfer.success',
                                data: { reference: 'ref-1' }
                        } as any);

                        // Assert - First call
                        expect(result1.status).toBe('success');

                        // Reset mocks
                        jest.clearAllMocks();
                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue({
                                id: 'wallet-789',
                                fund: jest.fn()
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act - Second call
                        const result2 = await useCase.execute({
                                event: 'transfer.failed',
                                data: { reference: 'ref-2' }
                        } as any);

                        // Assert - Second call
                        expect(result2.status).toBe('failed');
                });
        });
});
