import { VerifyPaymentWebhookUseCase } from '../../application/useCases/verifyPaymentWebhookWebhookUseCase.js';
import { PaymentNotFoundError, WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { PaymentWebHookEvent } from '../../application/dtos/PaymentDTO.js';
import { PaymentStatus } from '../../domain/enums/DomainEnums.js';

describe('VerifyPaymentWebhookUseCase', () => {
        let useCase: VerifyPaymentWebhookUseCase;
        let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
        let mockWalletRepository: jest.Mocked<IWalletRepository>;
        let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
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

                mockTransactionRepository = {
                        save: jest.fn(),
                        findById: jest.fn(),
                        findByWalletId: jest.fn(),
                        findByPaymentId: jest.fn(),
                        findByReference: jest.fn()
                } as any;

                mockUnitOfWork = {
                        transaction: jest.fn()
                } as any;

                useCase = new VerifyPaymentWebhookUseCase(
                        mockPaymentRepository,
                        mockWalletRepository,
                        mockTransactionRepository,
                        mockUnitOfWork
                );
        });

        describe('execute', () => {
                it('should process successful payment webhook', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 50000,
                                providerReference: 'paystack-ref-123',
                                status: PaymentStatus.PENDING,
                                markAsSuccess: jest.fn()
                        };

                        const mockWallet = {
                                id: 'wallet-789',
                                balance: 0,
                                fund: jest.fn(),
                                getState: jest.fn()
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue(mockWallet as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('success');
                        expect(mockPayment.markAsSuccess).toHaveBeenCalled();
                        expect(mockWallet.fund).toHaveBeenCalledWith(50000);
                });

                it('should throw PaymentNotFoundError when payment not found', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'non-existent'
                                }
                        } as any;

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute(webhookEvent)).rejects.toThrow(PaymentNotFoundError);
                });

                it('should ignore failed charge events', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.failed',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                status: PaymentStatus.PENDING
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('ignored');
                        expect(mockWalletRepository.findById).not.toHaveBeenCalled();
                });

                it('should ignore already processed successful payments (idempotency)', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                status: PaymentStatus.SUCCESS
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);

                        // Act
                        const result = await useCase.execute(webhookEvent);

                        // Assert
                        expect(result.status).toBe('already processed');
                        expect(mockWalletRepository.findById).not.toHaveBeenCalled();
                });

                it('should throw WalletNotFoundError when wallet not found', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                status: PaymentStatus.PENDING
                        };

                        mockPaymentRepository.findByProviderReference.mockResolvedValue(mockPayment as any);
                        mockWalletRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute(webhookEvent)).rejects.toThrow(WalletNotFoundError);
                });

                it('should save payment and wallet in transaction', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 50000,
                                status: PaymentStatus.PENDING,
                                markAsSuccess: jest.fn()
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
                        expect(mockPaymentRepository.save).toHaveBeenCalledWith(mockPayment, {});
                        expect(mockWalletRepository.save).toHaveBeenCalledWith(mockWallet, {});
                });

                it('should create transaction record for successful payment', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 50000,
                                providerReference: 'paystack-ref-123',
                                status: PaymentStatus.PENDING,
                                markAsSuccess: jest.fn()
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
                        expect(mockTransactionRepository.save).toHaveBeenCalled();
                });

                it('should handle webhook with correct transaction metadata', async () => {
                        // Arrange
                        const webhookEvent: PaymentWebHookEvent = {
                                event: 'charge.success',
                                data: {
                                        reference: 'paystack-ref-123'
                                }
                        } as any;

                        const mockPayment = {
                                id: 'payment-456',
                                walletId: 'wallet-789',
                                amountKobo: 50000,
                                providerReference: 'paystack-ref-123',
                                status: PaymentStatus.PENDING,
                                markAsSuccess: jest.fn()
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
                        expect(result.status).toBe('success');
                });
        });
});
