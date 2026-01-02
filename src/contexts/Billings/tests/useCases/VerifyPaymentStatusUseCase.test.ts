import { VerifyPaymentStatusUseCase } from '../../application/useCases/verifyPaymentStatusUseCase.js';
import { PaymentNotFoundError, ReferenceNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { PaymentStatus } from '../../domain/enums/DomainEnums.js';

describe('VerifyPaymentStatusUseCase', () => {
        let useCase: VerifyPaymentStatusUseCase;
        let mockPaymentProvider: jest.Mocked<IPaymentProvider>;
        let mockPaymentRepository: jest.Mocked<IPaymentRepository>;

        beforeEach(() => {
                mockPaymentProvider = {
                        initializePayment: jest.fn(),
                        verifyPayment: jest.fn(),
                        getTransferRecepient: jest.fn(),
                        initiateTransfer: jest.fn()
                } as any;

                mockPaymentRepository = {
                        save: jest.fn(),
                        findById: jest.fn(),
                        findByProviderReference: jest.fn(),
                        findBySystemReference: jest.fn(),
                        findAllByWalletId: jest.fn()
                } as any;

                useCase = new VerifyPaymentStatusUseCase(mockPaymentProvider, mockPaymentRepository);
        });

        describe('execute', () => {
                it('should return success immediately if payment already successful', async () => {
                        // Arrange
                        const systemReference = 'ref-123';
                        const mockPayment = {
                                id: 'payment-456',
                                systemReference,
                                status: PaymentStatus.SUCCESS,
                                providerReference: 'paystack-ref-789'
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);

                        // Act
                        const result = await useCase.execute(systemReference);

                        // Assert
                        expect(result.status).toBe('success');
                        expect(mockPaymentProvider.verifyPayment).not.toHaveBeenCalled();
                });

                it('should throw PaymentNotFoundError when payment not found', async () => {
                        // Arrange
                        mockPaymentRepository.findBySystemReference.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute('non-existent')).rejects.toThrow(PaymentNotFoundError);
                });

                it('should throw ReferenceNotFoundError when provider reference missing', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-456',
                                systemReference: 'ref-123',
                                status: PaymentStatus.PENDING,
                                providerReference: null
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);

                        // Act & Assert
                        await expect(useCase.execute('ref-123')).rejects.toThrow(ReferenceNotFoundError);
                });

                it('should verify payment with provider if status is pending', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-456',
                                systemReference: 'ref-123',
                                status: PaymentStatus.PENDING,
                                providerReference: 'paystack-ref-789',
                                markAsSuccess: jest.fn(),
                                getState: jest.fn()
                        };

                        const providerResponse = {
                                status: 'success'
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.verifyPayment.mockResolvedValue(providerResponse as any);

                        // Act
                        const result = await useCase.execute('ref-123');

                        // Assert
                        expect(mockPaymentProvider.verifyPayment).toHaveBeenCalledWith('paystack-ref-789');
                        expect(mockPayment.markAsSuccess).toHaveBeenCalled();
                        expect(result.status).toBe('success');
                });

                it('should mark payment as failed when provider returns failed', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-456',
                                systemReference: 'ref-123',
                                status: PaymentStatus.PENDING,
                                providerReference: 'paystack-ref-789',
                                markAsFailed: jest.fn(),
                                getState: jest.fn()
                        };

                        const providerResponse = {
                                status: 'failed'
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.verifyPayment.mockResolvedValue(providerResponse as any);

                        // Act
                        const result = await useCase.execute('ref-123');

                        // Assert
                        expect(mockPayment.markAsFailed).toHaveBeenCalled();
                        expect(mockPaymentRepository.save).toHaveBeenCalledWith(mockPayment);
                        expect(result.status).toBe('failed');
                });

                it('should save payment after marking as success', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-456',
                                systemReference: 'ref-123',
                                status: PaymentStatus.PENDING,
                                providerReference: 'paystack-ref-789',
                                markAsSuccess: jest.fn(),
                                getState: jest.fn()
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.verifyPayment.mockResolvedValue({
                                status: 'success'
                        } as any);

                        // Act
                        await useCase.execute('ref-123');

                        // Assert
                        expect(mockPaymentRepository.save).toHaveBeenCalledWith(mockPayment);
                });

                it('should return pending status when provider status is not success or failed', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-456',
                                systemReference: 'ref-123',
                                status: PaymentStatus.PENDING,
                                providerReference: 'paystack-ref-789'
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.verifyPayment.mockResolvedValue({
                                status: 'pending'
                        } as any);

                        // Act
                        const result = await useCase.execute('ref-123');

                        // Assert
                        expect(result.status).toBe('pending');
                });

                it('should handle payment with different system references', async () => {
                        // Arrange
                        const systemRef = 'custom-ref-999';
                        const mockPayment = {
                                id: 'payment-999',
                                systemReference: systemRef,
                                status: PaymentStatus.SUCCESS,
                                providerReference: 'paystack-ref-999'
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment as any);

                        // Act
                        await useCase.execute(systemRef);

                        // Assert
                        expect(mockPaymentRepository.findBySystemReference).toHaveBeenCalledWith(systemRef);
                });

                it('should handle multiple verify calls for different payments', async () => {
                        // Arrange
                        const mockPayment1 = {
                                id: 'payment-1',
                                systemReference: 'ref-1',
                                status: PaymentStatus.PENDING,
                                providerReference: 'paystack-1',
                                markAsSuccess: jest.fn()
                        };

                        mockPaymentRepository.findBySystemReference.mockResolvedValue(mockPayment1 as any);
                        mockPaymentProvider.verifyPayment.mockResolvedValue({
                                status: 'success'
                        } as any);

                        // Act
                        const result1 = await useCase.execute('ref-1');

                        // Assert
                        expect(result1.status).toBe('success');
                        expect(mockPaymentProvider.verifyPayment).toHaveBeenCalledWith('paystack-1');
                });
        });
});
