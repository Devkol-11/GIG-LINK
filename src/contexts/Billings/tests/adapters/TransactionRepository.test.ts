import { TransactionRepository } from '../../adapters/TransactionRepository.js';
import { Transaction } from '../../domain/entities/Transaction.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('TransactionRepository - UNIT TESTS', () => {
        let repository: TransactionRepository;
        let mockPrismaTransaction: jest.Mocked<typeof prismaDbClient.transaction>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaTransaction = prismaDbClient.transaction as jest.Mocked<
                        typeof prismaDbClient.transaction
                >;
                repository = new TransactionRepository();
        });

        describe('findById', () => {
                it('should return transaction when found', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'txn-123',
                                walletId: 'wallet-456',
                                paymentId: 'payment-789',
                                amount: 50000,
                                type: 'CREDIT',
                                reference: 'ref-001',
                                description: 'Payment deposit',
                                metadata: { provider: 'paystack' },
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('txn-123');

                        // Assert
                        expect(mockPrismaTransaction.findUnique).toHaveBeenCalledWith({
                                where: { id: 'txn-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when transaction not found', async () => {
                        // Arrange
                        mockPrismaTransaction.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findById('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should handle metadata as null', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'txn-123',
                                metadata: null
                        };

                        mockPrismaTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('txn-123');

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('findByWalletId', () => {
                it('should return all transactions for wallet', async () => {
                        // Arrange
                        const mockRecords = [
                                {
                                        id: 'txn-1',
                                        walletId: 'wallet-456',
                                        amount: 50000,
                                        type: 'CREDIT',
                                        createdAt: new Date()
                                },
                                {
                                        id: 'txn-2',
                                        walletId: 'wallet-456',
                                        amount: 30000,
                                        type: 'DEBIT',
                                        createdAt: new Date()
                                }
                        ];

                        mockPrismaTransaction.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findByWalletId('wallet-456');

                        // Assert
                        expect(mockPrismaTransaction.findMany).toHaveBeenCalledWith({
                                where: { walletId: 'wallet-456' },
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result).toHaveLength(2);
                });

                it('should return empty array when no transactions', async () => {
                        // Arrange
                        mockPrismaTransaction.findMany.mockResolvedValue([]);

                        // Act
                        const result = await repository.findByWalletId('wallet-456');

                        // Assert
                        expect(result).toEqual([]);
                });

                it('should order transactions by created date descending', async () => {
                        // Arrange
                        mockPrismaTransaction.findMany.mockResolvedValue([]);

                        // Act
                        await repository.findByWalletId('wallet-456');

                        // Assert
                        expect(mockPrismaTransaction.findMany).toHaveBeenCalledWith({
                                where: { walletId: 'wallet-456' },
                                orderBy: { createdAt: 'desc' }
                        });
                });
        });

        describe('findByPaymentId', () => {
                it('should find transactions by payment id', async () => {
                        // Arrange
                        const mockRecords = [
                                {
                                        id: 'txn-1',
                                        paymentId: 'payment-123',
                                        amount: 50000
                                },
                                {
                                        id: 'txn-2',
                                        paymentId: 'payment-123',
                                        amount: 10000
                                }
                        ];

                        mockPrismaTransaction.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findByPaymentId('payment-123');

                        // Assert
                        expect(mockPrismaTransaction.findMany).toHaveBeenCalledWith({
                                where: { paymentId: 'payment-123' }
                        });
                        expect(result).toHaveLength(2);
                });

                it('should return empty array when payment has no transactions', async () => {
                        // Arrange
                        mockPrismaTransaction.findMany.mockResolvedValue([]);

                        // Act
                        const result = await repository.findByPaymentId('payment-123');

                        // Assert
                        expect(result).toEqual([]);
                });
        });

        describe('findByReference', () => {
                it('should find transaction by reference', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'txn-123',
                                reference: 'ref-001',
                                amount: 50000,
                                type: 'CREDIT'
                        };

                        mockPrismaTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByReference('ref-001');

                        // Assert
                        expect(mockPrismaTransaction.findUnique).toHaveBeenCalledWith({
                                where: { reference: 'ref-001' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when reference not found', async () => {
                        // Arrange
                        mockPrismaTransaction.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByReference('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('save', () => {
                it('should create transaction successfully', async () => {
                        // Arrange
                        const mockTransactionData = {
                                id: 'txn-123',
                                walletId: 'wallet-456',
                                paymentId: 'payment-789',
                                amount: 50000,
                                type: 'CREDIT',
                                reference: 'ref-001',
                                description: 'Payment deposit',
                                metadata: { provider: 'paystack' }
                        };

                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue(mockTransactionData)
                        };

                        mockPrismaTransaction.create.mockResolvedValue(mockTransactionData as any);

                        // Act
                        const result = await repository.save(mockTransaction as any);

                        // Assert
                        expect(mockPrismaTransaction.create).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should handle null metadata', async () => {
                        // Arrange
                        const mockTransactionData = {
                                id: 'txn-123',
                                walletId: 'wallet-456',
                                amount: 50000,
                                metadata: null
                        };

                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue(mockTransactionData)
                        };

                        mockPrismaTransaction.create.mockResolvedValue(mockTransactionData as any);

                        // Act
                        await repository.save(mockTransaction as any);

                        // Assert
                        expect(mockPrismaTransaction.create).toHaveBeenCalled();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockTransactionData = {
                                id: 'txn-123',
                                amount: 50000
                        };

                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue(mockTransactionData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaTransaction.create.mockResolvedValue(mockTransactionData as any);

                        // Act
                        const result = await repository.save(mockTransaction as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle concurrent modification errors', async () => {
                        // Arrange
                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue({ id: 'txn-123' })
                        };

                        mockPrismaTransaction.create.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError('', {
                                        code: 'P2025',
                                        clientVersion: '1.0'
                                })
                        );

                        // Act & Assert
                        await expect(repository.save(mockTransaction as any)).rejects.toThrow();
                });

                it('should handle constraint violations on save', async () => {
                        // Arrange
                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue({ id: 'txn-123' })
                        };

                        mockPrismaTransaction.create.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                                        code: 'P2002',
                                        clientVersion: '1.0'
                                })
                        );

                        // Act & Assert
                        await expect(repository.save(mockTransaction as any)).rejects.toThrow();
                });
        });

        describe('error handling', () => {
                it('should handle database errors on findById', async () => {
                        // Arrange
                        mockPrismaTransaction.findUnique.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.findById('txn-123')).rejects.toThrow('Database error');
                });

                it('should handle database errors on findByWalletId', async () => {
                        // Arrange
                        mockPrismaTransaction.findMany.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.findByWalletId('wallet-456')).rejects.toThrow(
                                'Database error'
                        );
                });

                it('should handle connection errors on save', async () => {
                        // Arrange
                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue({ id: 'txn-123' })
                        };

                        mockPrismaTransaction.create.mockRejectedValue(new Error('Connection error'));

                        // Act & Assert
                        await expect(repository.save(mockTransaction as any)).rejects.toThrow(
                                'Connection error'
                        );
                });
        });

        describe('entity mapping', () => {
                it('should map database record to transaction entity', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'txn-123',
                                walletId: 'wallet-456',
                                paymentId: 'payment-789',
                                amount: 50000,
                                type: 'CREDIT',
                                reference: 'ref-001',
                                description: 'Payment deposit'
                        };

                        mockPrismaTransaction.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('txn-123');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should preserve transaction state across operations', async () => {
                        // Arrange
                        const mockRecords = [
                                { id: 'txn-1', walletId: 'wallet-456', amount: 50000 },
                                { id: 'txn-2', walletId: 'wallet-456', amount: 30000 }
                        ];

                        mockPrismaTransaction.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findByWalletId('wallet-456');

                        // Assert
                        expect(result).toHaveLength(2);
                        expect(result[0].id).toBe('txn-1');
                        expect(result[1].id).toBe('txn-2');
                });

                it('should handle various transaction types', async () => {
                        // Arrange
                        const mockRecords = [
                                { id: 'txn-1', type: 'CREDIT', amount: 50000 },
                                { id: 'txn-2', type: 'DEBIT', amount: 30000 },
                                { id: 'txn-3', type: 'REVERSAL', amount: 20000 }
                        ];

                        mockPrismaTransaction.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findByWalletId('wallet-456');

                        // Assert
                        expect(result).toHaveLength(3);
                        expect(result[0].type).toBe('CREDIT');
                        expect(result[1].type).toBe('DEBIT');
                        expect(result[2].type).toBe('REVERSAL');
                });
        });

        describe('transaction handling', () => {
                it('should work with transaction client for all read operations', async () => {
                        // Arrange
                        const mockRecord = { id: 'txn-123' };
                        const mockTrx = {} as Prisma.TransactionClient;

                        mockPrismaTransaction.findUnique.mockResolvedValue(mockRecord as any);
                        mockPrismaTransaction.findMany.mockResolvedValue([mockRecord] as any);

                        // Act
                        await repository.findById('txn-123', mockTrx);
                        await repository.findByWalletId('wallet-456', mockTrx);
                        await repository.findByPaymentId('payment-123', mockTrx);
                        await repository.findByReference('ref-001', mockTrx);

                        // Assert
                        expect(mockPrismaTransaction.findUnique).toHaveBeenCalledTimes(2);
                        expect(mockPrismaTransaction.findMany).toHaveBeenCalledTimes(2);
                });

                it('should work with transaction client for write operations', async () => {
                        // Arrange
                        const mockRecord = { id: 'txn-123' };
                        const mockTrx = {} as Prisma.TransactionClient;

                        const mockTransaction = {
                                id: 'txn-123',
                                getState: jest.fn().mockReturnValue({ id: 'txn-123' })
                        };

                        mockPrismaTransaction.create.mockResolvedValue(mockRecord as any);

                        // Act
                        await repository.save(mockTransaction as any, mockTrx);

                        // Assert
                        expect(mockPrismaTransaction.create).toHaveBeenCalled();
                });
        });

        describe('pagination and filtering', () => {
                it('should handle multiple transactions for same wallet', async () => {
                        // Arrange
                        const mockRecords = Array.from({ length: 5 }, (_, i) => ({
                                id: `txn-${i}`,
                                walletId: 'wallet-456',
                                amount: (i + 1) * 10000,
                                createdAt: new Date(Date.now() - i * 1000)
                        }));

                        mockPrismaTransaction.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findByWalletId('wallet-456');

                        // Assert
                        expect(result).toHaveLength(5);
                });

                it('should handle multiple transactions for same payment', async () => {
                        // Arrange
                        const mockRecords = [
                                { id: 'txn-1', paymentId: 'payment-123', amount: 50000 },
                                { id: 'txn-2', paymentId: 'payment-123', amount: 10000 }
                        ];

                        mockPrismaTransaction.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findByPaymentId('payment-123');

                        // Assert
                        expect(result).toHaveLength(2);
                        expect(result.every((t) => t.paymentId === 'payment-123')).toBe(true);
                });
        });
});
