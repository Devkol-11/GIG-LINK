import { WithdrawalRequestUseCase } from '../../application/useCases/withdrawRequestUseCase.js';
import { WalletNotFoundError, PayoutAccountError } from '../../domain/errors/domainErrors.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IPayoutAccountRepository } from '../../ports/IPayoutAccountRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { WithdrawalRequestCommand } from '../../application/dtos/WithdrawalDTO.js';

describe('WithdrawalRequestUseCase', () => {
        let useCase: WithdrawalRequestUseCase;
        let mockWalletRepository: jest.Mocked<IWalletRepository>;
        let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
        let mockPayoutAccountRepository: jest.Mocked<IPayoutAccountRepository>;
        let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
        let mockPaymentProvider: jest.Mocked<IPaymentProvider>;

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

                mockPayoutAccountRepository = {
                        save: jest.fn(),
                        findByUserId: jest.fn()
                } as any;

                mockUnitOfWork = {
                        transaction: jest.fn()
                } as any;

                mockPaymentProvider = {
                        initializePayment: jest.fn(),
                        verifyPayment: jest.fn(),
                        getTransferRecepient: jest.fn(),
                        initiateTransfer: jest.fn()
                } as any;

                useCase = new WithdrawalRequestUseCase(
                        mockWalletRepository,
                        mockPaymentRepository,
                        mockPayoutAccountRepository,
                        mockUnitOfWork,
                        mockPaymentProvider
                );
        });

        describe('execute', () => {
                it('should process withdrawal request successfully with existing payout account', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 500,
                                bankCode: '044'
                        };

                        const mockWallet = {
                                id: 'wallet-456',
                                userId: 'user-123',
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        const mockPayoutAccount = {
                                userId: 'user-123',
                                code: 'RCP_f3b7fbf2d0bfb097be91e78f1e9adc88'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                amountKobo: 50000,
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        const initResponse = {
                                status: 'success',
                                message: 'Transfer initiated',
                                providerReference: 'TRF_123456789'
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPayoutAccountRepository.findByUserId.mockResolvedValue(mockPayoutAccount as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initiateTransfer.mockResolvedValue(initResponse as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(withdrawalDto);

                        // Assert
                        expect(result.status).toBe('success');
                        expect(mockWallet.debit).toHaveBeenCalledWith(50000);
                        expect(mockPayment.addProviderReference).toHaveBeenCalledWith('TRF_123456789');
                });

                it('should throw WalletNotFoundError when wallet not found', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 500,
                                bankCode: '044'
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.execute(withdrawalDto)).rejects.toThrow(WalletNotFoundError);
                });

                it('should create payout account if not exists', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 500,
                                bankCode: '044'
                        };

                        const mockWallet = {
                                id: 'wallet-456',
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        const recipientResponse = {
                                accountNumber: '0123456789',
                                recipientCode: 'RCP_new_code',
                                verifiedAccountName: 'John Doe'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        const initResponse = {
                                status: 'success',
                                message: 'Transfer initiated',
                                providerReference: 'TRF_123'
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPayoutAccountRepository.findByUserId.mockResolvedValue(null);
                        mockPaymentProvider.getTransferRecepient.mockResolvedValue(recipientResponse as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initiateTransfer.mockResolvedValue(initResponse as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(withdrawalDto);

                        // Assert
                        expect(mockPaymentProvider.getTransferRecepient).toHaveBeenCalled();
                        expect(mockPayoutAccountRepository.save).toHaveBeenCalled();
                        expect(result.status).toBe('success');
                });

                it('should throw PayoutAccountError when account code is missing', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 500,
                                bankCode: '044'
                        };

                        const mockWallet = {
                                id: 'wallet-456'
                        };

                        const mockPayoutAccountWithoutCode = {
                                userId: 'user-123',
                                code: null
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPayoutAccountRepository.findByUserId.mockResolvedValue(
                                mockPayoutAccountWithoutCode as any
                        );

                        // Act & Assert
                        await expect(useCase.execute(withdrawalDto)).rejects.toThrow(PayoutAccountError);
                });

                it('should save wallet and payment in transaction', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 500,
                                bankCode: '044'
                        };

                        const mockWallet = {
                                id: 'wallet-456',
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        const mockPayoutAccount = {
                                userId: 'user-123',
                                code: 'RCP_code'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPayoutAccountRepository.findByUserId.mockResolvedValue(mockPayoutAccount as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initiateTransfer.mockResolvedValue({
                                status: 'success',
                                message: 'Transfer initiated',
                                providerReference: 'TRF_123'
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute(withdrawalDto);

                        // Assert
                        expect(mockUnitOfWork.transaction).toHaveBeenCalled();
                        expect(mockWalletRepository.save).toHaveBeenCalled();
                        expect(mockPaymentRepository.save).toHaveBeenCalled();
                });

                it('should debit wallet with correct amount', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 1000,
                                bankCode: '044'
                        };

                        const mockWallet = {
                                id: 'wallet-456',
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        const mockPayoutAccount = {
                                userId: 'user-123',
                                code: 'RCP_code'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                amountKobo: 100000,
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPayoutAccountRepository.findByUserId.mockResolvedValue(mockPayoutAccount as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initiateTransfer.mockResolvedValue({
                                status: 'success',
                                providerReference: 'TRF_123'
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        await useCase.execute(withdrawalDto);

                        // Assert
                        expect(mockWallet.debit).toHaveBeenCalledWith(100000);
                });

                it('should handle different bank codes', async () => {
                        // Arrange
                        const withdrawalDto: WithdrawalRequestCommand = {
                                userId: 'user-123',
                                name: 'John Doe',
                                accountNumber: '0123456789',
                                amount: 500,
                                bankCode: '033' // Different bank
                        };

                        const mockWallet = {
                                id: 'wallet-456',
                                debit: jest.fn(),
                                getState: jest.fn()
                        };

                        const mockPayoutAccount = {
                                userId: 'user-123',
                                code: 'RCP_code'
                        };

                        const mockPayment = {
                                id: 'payment-789',
                                systemReference: 'ref-123',
                                addProviderReference: jest.fn(),
                                markAsPending: jest.fn()
                        };

                        mockWalletRepository.findByUserId.mockResolvedValue(mockWallet as any);
                        mockPayoutAccountRepository.findByUserId.mockResolvedValue(mockPayoutAccount as any);
                        mockPaymentRepository.save.mockResolvedValue(mockPayment as any);
                        mockPaymentProvider.initiateTransfer.mockResolvedValue({
                                status: 'success',
                                providerReference: 'TRF_123'
                        } as any);
                        mockUnitOfWork.transaction.mockImplementation(async (cb) => cb({} as any));

                        // Act
                        const result = await useCase.execute(withdrawalDto);

                        // Assert
                        expect(result.status).toBe('success');
                });
        });
});
