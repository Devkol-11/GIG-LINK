import { PaymentRequestUseCase } from '../../application/useCases/paymentRequestUseCase.js';
import { WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';

describe('PaymentRequestUseCase', () => {
        let useCase: PaymentRequestUseCase;
        let mockWalletRepository: jest.Mocked<IWalletRepository>;
        let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
        let mockPaymentProvider: jest.Mocked<IPaymentProvider>;
        let mockUnitOfWork: jest.Mocked<IUnitOfWork>;

        beforeEach(() => {
                mockWalletRepository = {
                        findByUserId: jest.fn(),
                        findById: jest.fn(),
                        save: jest.fn()
                } as any;

                mockPaymentRepository = {
                        save: jest.fn(),
                        findById: jest.fn(),
                        findByProviderReference: jest.fn(),
                        findBySystemReference: jest.fn(),
                        findAllByWalletId: jest.fn()
                } as any;

                mockPaymentProvider = {
                        initializePayment: jest.fn(),
                        verifyPayment: jest.fn(),
                        getTransferRecepient: jest.fn(),
                        initiateTransfer: jest.fn()
                } as any;

                mockUnitOfWork = {
                        transaction: jest.fn()
                } as any;

                useCase = new PaymentRequestUseCase(
                        mockWalletRepository,
                        mockPaymentRepository,
                        mockPaymentProvider,
                        mockUnitOfWork
                );
        });

        describe('Execute', () => {
                it('should initialize payment successfully', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const email = 'user@example.com';
                        const amount = 100;

                        const mockWallet = {
                                id: 'wallet-456',
                                userId
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                walletId: 'wallet-456',
                                amountKobo: 10000,
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn(),
                                getState: jest.fn()
                        };

                        const providerResponse = {
                                authorizationUrl: 'https://checkout.paystack.com/abc123',
                                reference: 'paystack-ref-456',
                                accessCode: 'access-123'
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initializePayment.mockResolvedValue(providerResponse as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.Execute(userId, email, amount);

                        // Assert
                        expect(mockWalletRepository.findByUserId).toHaveBeenCalledWith(userId);
                        expect(result.authorizationUrl).toBe(providerResponse.authorizationUrl);
                        expect(result.reference).toBe(providerResponse.reference);
                });

                it('should throw WalletNotFoundError when wallet not found', async () => {
                        // Arrange
                        mockWalletRepository.findByUserId.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.Execute('user-123', 'user@example.com', 100)).rejects.toThrow(
                                WalletNotFoundError
                        );
                });

                it('should save payment before provider initialization', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-456'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initializePayment.mockResolvedValue({
                                authorizationUrl: 'https://example.com',
                                reference: 'ref-456'
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.Execute('user-123', 'user@example.com', 100);

                        // Assert
                        expect(mockPaymentRepository.save).toHaveBeenCalledTimes(2);
                });

                it('should add provider reference to payment', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-456'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        const providerResponse = {
                                authorizationUrl: 'https://example.com',
                                reference: 'paystack-ref-456'
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initializePayment.mockResolvedValue(providerResponse as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.Execute('user-123', 'user@example.com', 100);

                        // Assert
                        expect(mockPayment.addProviderReference).toHaveBeenCalledWith(
                                providerResponse.reference
                        );
                        expect(mockPayment.markAsPending).toHaveBeenCalled();
                });

                it('should execute transaction after setting payment status', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-456'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        const transactionCallback = jest.fn();

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initializePayment.mockResolvedValue({
                                authorizationUrl: 'https://example.com',
                                reference: 'ref-456'
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => {
                                transactionCallback();
                                await cb({} as any);
                        });

                        // Act
                        await useCase.Execute('user-123', 'user@example.com', 100);

                        // Assert
                        expect(transactionCallback).toHaveBeenCalled();
                });

                it('should handle different amounts correctly', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-456'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                amountKobo: 50000,
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initializePayment.mockResolvedValue({
                                authorizationUrl: 'https://example.com',
                                reference: 'ref-456'
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.Execute('user-123', 'user@example.com', 500);

                        // Assert
                        expect(mockPaymentRepository.save).toHaveBeenCalled();
                });
        });
});
