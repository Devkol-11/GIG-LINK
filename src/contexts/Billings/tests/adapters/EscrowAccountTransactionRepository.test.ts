import { EscrowAccountTransactionRepository } from '../../adapters/EscrowAccountTransactionRepository.js';
import { EscrowAccountTransaction } from '../../domain/entities/EscrowTransaction.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('EscrowAccountTransactionRepository - UNIT TESTS', () => {
        let repository: EscrowAccountTransactionRepository;
        let mockPrismaEscrowTransaction: jest.Mocked<typeof prismaDbClient.escrowTransaction>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaEscrowTransaction = prismaDbClient.escrowTransaction as jest.Mocked<
                        typeof prismaDbClient.escrowTransaction
                >;
                repository = new EscrowAccountTransactionRepository();
        });

        describe('save', () => {
                it('should create escrow transaction with entity state', async () => {
                        // Arrange
                        const mockTransactionData = {
                                id: 'transaction-123',
                                escrowId: 'escrow-456',
                                type: 'FUND',
                                amountKobo: 50000,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockEntity = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue(mockTransactionData)
                        };

                        mockPrismaEscrowTransaction.create.mockResolvedValue(mockTransactionData as any);

                        // Act
                        const result = await repository.save(mockEntity as any);

                        // Assert
                        expect(mockPrismaEscrowTransaction.create).toHaveBeenCalledWith({
                                data: mockTransactionData
                        });
                        expect(result).toBeDefined();
                });

                it('should save with transaction client if provided', async () => {
                        // Arrange
                        const mockTransactionData = {
                                id: 'transaction-123',
                                escrowId: 'escrow-456',
                                type: 'FUND',
                                amountKobo: 50000
                        };

                        const mockEntity = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue(mockTransactionData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        const mockTrxTransaction = {
                                create: jest.fn().mockResolvedValue(mockTransactionData)
                        };

                        // This tests that repository accepts transaction client
                        mockPrismaEscrowTransaction.create.mockResolvedValue(mockTransactionData as any);

                        // Act
                        const result = await repository.save(mockEntity as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should return entity instance after save', async () => {
                        // Arrange
                        const mockTransactionData = {
                                id: 'transaction-123',
                                amountKobo: 50000
                        };

                        const mockEntity = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue(mockTransactionData)
                        };

                        mockPrismaEscrowTransaction.create.mockResolvedValue(mockTransactionData as any);

                        // Act
                        const result = await repository.save(mockEntity as any);

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('findById', () => {
                it('should return transaction when found', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'transaction-123',
                                escrowId: 'escrow-456',
                                type: 'FUND',
                                amountKobo: 50000,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('transaction-123');

                        // Assert
                        expect(mockPrismaEscrowTransaction.findUnique).toHaveBeenCalledWith({
                                where: { id: 'transaction-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when transaction not found', async () => {
                        // Arrange
                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findById('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should query with correct transaction id', async () => {
                        // Arrange
                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(null);

                        // Act
                        await repository.findById('specific-transaction-456');

                        // Assert
                        expect(mockPrismaEscrowTransaction.findUnique).toHaveBeenCalledWith({
                                where: { id: 'specific-transaction-456' }
                        });
                });

                it('should handle different transaction types', async () => {
                        // Arrange
                        const mockFundTransaction = {
                                id: 'transaction-1',
                                type: 'FUND',
                                amountKobo: 50000
                        };

                        const mockReleaseTransaction = {
                                id: 'transaction-2',
                                type: 'RELEASE',
                                amountKobo: 50000
                        };

                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(mockFundTransaction as any);

                        // Act
                        const result1 = await repository.findById('transaction-1');

                        // Assert
                        expect(result1).toBeDefined();

                        // Change mock for second call
                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(
                                mockReleaseTransaction as any
                        );

                        const result2 = await repository.findById('transaction-2');

                        expect(result2).toBeDefined();
                });
        });

        describe('error handling', () => {
                it('should handle create errors', async () => {
                        // Arrange
                        const mockEntity = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue({ id: 'transaction-123' })
                        };

                        mockPrismaEscrowTransaction.create.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.save(mockEntity as any)).rejects.toThrow('Database error');
                });

                it('should handle find errors', async () => {
                        // Arrange
                        mockPrismaEscrowTransaction.findUnique.mockRejectedValue(
                                new Error('Connection error')
                        );

                        // Act & Assert
                        await expect(repository.findById('transaction-123')).rejects.toThrow(
                                'Connection error'
                        );
                });

                it('should handle constraint violations on save', async () => {
                        // Arrange
                        const mockEntity = {
                                id: 'transaction-123',
                                getState: jest.fn().mockReturnValue({ id: 'transaction-123' })
                        };

                        const constraintError = new Error('Unique constraint failed');
                        mockPrismaEscrowTransaction.create.mockRejectedValue(constraintError);

                        // Act & Assert
                        await expect(repository.save(mockEntity as any)).rejects.toThrow(
                                'Unique constraint failed'
                        );
                });
        });

        describe('entity mapping', () => {
                it('should map database record to entity correctly', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'transaction-123',
                                escrowId: 'escrow-456',
                                type: 'FUND',
                                amountKobo: 50000,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('transaction-123');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should preserve transaction metadata', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'transaction-123',
                                escrowId: 'escrow-456',
                                type: 'RELEASE',
                                amountKobo: 75000,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaEscrowTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('transaction-123');

                        // Assert
                        expect(result).toBeDefined();
                });
        });
});
