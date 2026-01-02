import { GetEscrowAccountTransactionUseCase } from '../../application/useCases/getEscrowTransactionUseCase.js';
import { EscrowTransactionNotFoundError } from '../../domain/errors/domainErrors.js';
import { IEscrowAccountTransactionRepository } from '../../ports/IEscrowAccountTransaction.js';

describe('GetEscrowAccountTransactionUseCase', () => {
        let useCase: GetEscrowAccountTransactionUseCase;
        let mockRepository: jest.Mocked<IEscrowAccountTransactionRepository>;

        beforeEach(() => {
                mockRepository = {
                        findById: jest.fn(),
                        save: jest.fn()
                } as any;

                useCase = new GetEscrowAccountTransactionUseCase(mockRepository);
        });

        describe('Execute', () => {
                it('should return transaction when found', async () => {
                        // Arrange
                        const transactionId = 'transaction-123';
                        const mockTransaction = {
                                id: transactionId,
                                escrowId: 'escrow-456',
                                amountKobo: 50000,
                                type: 'FUND',
                                getState: jest.fn().mockReturnValue({
                                        id: transactionId,
                                        escrowId: 'escrow-456',
                                        amountKobo: 50000,
                                        type: 'FUND'
                                })
                        };

                        mockRepository.findById.mockResolvedValue(mockTransaction as any);

                        // Act
                        const result = await useCase.Execute(transactionId);

                        // Assert
                        expect(mockRepository.findById).toHaveBeenCalledWith(transactionId);
                        expect(result).toEqual({
                                id: transactionId,
                                escrowId: 'escrow-456',
                                amountKobo: 50000,
                                type: 'FUND'
                        });
                });

                it('should throw EscrowTransactionNotFoundError when transaction not found', async () => {
                        // Arrange
                        mockRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.Execute('non-existent')).rejects.toThrow(
                                EscrowTransactionNotFoundError
                        );
                });

                it('should throw error with correct message', async () => {
                        // Arrange
                        mockRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(useCase.Execute('transaction-123')).rejects.toThrow(
                                'no transactions for this account'
                        );
                });

                it('should call repository with correct transaction id', async () => {
                        // Arrange
                        const mockTransaction = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue({ id: 'transaction-123' })
                        };

                        mockRepository.findById.mockResolvedValue(mockTransaction as any);

                        // Act
                        await useCase.Execute('transaction-123');

                        // Assert
                        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
                        expect(mockRepository.findById).toHaveBeenCalledWith('transaction-123');
                });

                it('should return transaction state correctly', async () => {
                        // Arrange
                        const transactionState = {
                                id: 'transaction-123',
                                escrowId: 'escrow-456',
                                amountKobo: 100000,
                                type: 'RELEASE',
                                createdAt: new Date()
                        };

                        const mockTransaction = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue(transactionState)
                        };

                        mockRepository.findById.mockResolvedValue(mockTransaction as any);

                        // Act
                        const result = await useCase.Execute('transaction-123');

                        // Assert
                        expect(result).toEqual(transactionState);
                        expect(mockTransaction.getState).toHaveBeenCalled();
                });
        });
});
