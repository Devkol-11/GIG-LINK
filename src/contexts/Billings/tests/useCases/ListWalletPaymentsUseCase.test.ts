import { ListWalletPaymentUseCase } from '../../application/useCases/listWalletPaymentsUseCase.js';
import { WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';

describe('ListWalletPaymentUseCase', () => {
        let useCase: ListWalletPaymentUseCase;
        let mockWalletRepository: jest.Mocked<IWalletRepository>;
        let mockPaymentRepository: jest.Mocked<IPaymentRepository>;

        beforeEach(() => {
                mockWalletRepository = {
                        findByUserId: jest.fn(),
                        findById: jest.fn(),
                        save: jest.fn()
                } as any;

                mockPaymentRepository = {
                        findAllByWalletId: jest.fn(),
                        findById: jest.fn(),
                        save: jest.fn(),
                        findByProviderReference: jest.fn(),
                        findBySystemReference: jest.fn()
                } as any;

                useCase = new ListWalletPaymentUseCase(mockWalletRepository, mockPaymentRepository);
        });

        describe('Execute', () => {
                it('should return list of payments for user', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const walletId = 'wallet-456';

                        const mockWallet = {
                                id: walletId,
                                userId,
                                getState: jest.fn()
                        };

                        const mockPayments = [
                                {
                                        id: 'payment-1',
                                        walletId,
                                        amountKobo: 50000,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'payment-1',
                                                amountKobo: 50000,
                                                status: 'SUCCESS'
                                        })
                                },
                                {
                                        id: 'payment-2',
                                        walletId,
                                        amountKobo: 75000,
                                        getState: jest.fn().mockReturnValue({
                                                id: 'payment-2',
                                                amountKobo: 75000,
                                                status: 'PENDING'
                                        })
                                }
                        ];

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.findAllByWalletId.mockResolvedValue(mockPayments as any);

                        // Act
                        const result = await useCase.Execute(userId);

                        // Assert
                        expect(mockWalletRepository.findByUserId).toHaveBeenCalledWith(userId);
                        expect(mockPaymentRepository.findAllByWalletId).toHaveBeenCalledWith(walletId);
                        expect(result).toHaveLength(2);
                        expect(result[0]).toEqual({
                                id: 'payment-1',
                                amountKobo: 50000,
                                status: 'SUCCESS'
                        });
                });

                it('should throw WalletNotFoundError when wallet not found', async () => {
                        // Arrange
                        mockWalletRepository.findByUserId.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.Execute('user-123')).rejects.toThrow(WalletNotFoundError);
                });

                it('should return empty array when no payments', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const mockWallet = {
                                id: 'wallet-456',
                                userId
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.findAllByWalletId.mockResolvedValue([]);

                        // Act
                        const result = await useCase.Execute(userId);

                        // Assert
                        expect(result).toEqual([]);
                        expect(mockPaymentRepository.findAllByWalletId).toHaveBeenCalledWith('wallet-456');
                });

                it('should map payments to state correctly', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const walletId = 'wallet-456';

                        const mockWallet = {
                                id: walletId,
                                userId
                        };

                        const mockPayment = {
                                id: 'payment-1',
                                walletId,
                                amountKobo: 50000,
                                getState: jest.fn().mockReturnValue({
                                        id: 'payment-1',
                                        amountKobo: 50000,
                                        status: 'SUCCESS',
                                        createdAt: new Date()
                                })
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.findAllByWalletId.mockResolvedValue([mockPayment] as any);

                        // Act
                        const result = await useCase.Execute(userId);

                        // Assert
                        expect(mockPayment.getState).toHaveBeenCalled();
                        expect(result[0]).toHaveProperty('id');
                        expect(result[0]).toHaveProperty('amountKobo');
                });

                it('should handle wallet with multiple payments', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const walletId = 'wallet-456';

                        const mockWallet = {
                                id: walletId,
                                userId
                        };

                        const mockPayments = Array.from({ length: 5 }, (_, i) => ({
                                id: `payment-${i}`,
                                walletId,
                                amountKobo: 50000 * (i + 1),
                                getState: jest.fn().mockReturnValue({
                                        id: `payment-${i}`,
                                        amountKobo: 50000 * (i + 1)
                                })
                        }));

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPaymentRepository.findAllByWalletId.mockResolvedValue(mockPayments as any);

                        // Act
                        const result = await useCase.Execute(userId);

                        // Assert
                        expect(result).toHaveLength(5);
                        expect(mockPaymentRepository.findAllByWalletId).toHaveBeenCalledWith(walletId);
                });
        });
});
