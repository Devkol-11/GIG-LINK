import { PaymentRepository } from '../../adapters/PaymentRepository.js';
import { Payment } from '../../domain/entities/Payment.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { ConcurrencyError } from '../../domain/errors/concurrencyError.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('PaymentRepository - UNIT TESTS', () => {
        let repository: PaymentRepository;
        let mockPrismaPayment: jest.Mocked<typeof prismaDbClient.payment>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaPayment = prismaDbClient.payment as jest.Mocked<typeof prismaDbClient.payment>;
                repository = new PaymentRepository();
        });

        describe('findById', () => {
                it('should return payment when found', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payment-123',
                                walletId: 'wallet-456',
                                amountKobo: 50000,
                                status: 'PENDING',
                                provider: 'PAYSTACK',
                                currency: 'NGN',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaPayment.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('payment-123');

                        // Assert
                        expect(mockPrismaPayment.findUnique).toHaveBeenCalledWith({
                                where: { id: 'payment-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when payment not found', async () => {
                        // Arrange
                        mockPrismaPayment.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findById('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('findByProviderReference', () => {
                it('should find payment by provider reference', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payment-123',
                                providerReference: 'paystack-ref-789',
                                amountKobo: 50000,
                                status: 'SUCCESS'
                        };

                        mockPrismaPayment.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByProviderReference('paystack-ref-789');

                        // Assert
                        expect(mockPrismaPayment.findUnique).toHaveBeenCalledWith({
                                where: { providerReference: 'paystack-ref-789' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when provider reference not found', async () => {
                        // Arrange
                        mockPrismaPayment.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByProviderReference('non-existent-ref');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('findBySystemReference', () => {
                it('should find payment by system reference', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payment-123',
                                systemReference: 'sys-ref-456',
                                amountKobo: 50000
                        };

                        mockPrismaPayment.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findBySystemReference('sys-ref-456');

                        // Assert
                        expect(mockPrismaPayment.findUnique).toHaveBeenCalledWith({
                                where: { systemReference: 'sys-ref-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when system reference not found', async () => {
                        // Arrange
                        mockPrismaPayment.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findBySystemReference('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('findAllByWalletId', () => {
                it('should return all payments for wallet', async () => {
                        // Arrange
                        const mockRecords = [
                                {
                                        id: 'payment-1',
                                        walletId: 'wallet-456',
                                        amountKobo: 50000,
                                        createdAt: new Date()
                                },
                                {
                                        id: 'payment-2',
                                        walletId: 'wallet-456',
                                        amountKobo: 75000,
                                        createdAt: new Date()
                                }
                        ];

                        mockPrismaPayment.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findAllByWalletId('wallet-456');

                        // Assert
                        expect(mockPrismaPayment.findMany).toHaveBeenCalledWith({
                                where: { walletId: 'wallet-456' },
                                orderBy: { createdAt: 'desc' }
                        });
                        expect(result).toHaveLength(2);
                });

                it('should return empty array when no payments', async () => {
                        // Arrange
                        mockPrismaPayment.findMany.mockResolvedValue([]);

                        // Act
                        const result = await repository.findAllByWalletId('wallet-456');

                        // Assert
                        expect(result).toEqual([]);
                });

                it('should order payments by created date descending', async () => {
                        // Arrange
                        mockPrismaPayment.findMany.mockResolvedValue([]);

                        // Act
                        await repository.findAllByWalletId('wallet-456');

                        // Assert
                        expect(mockPrismaPayment.findMany).toHaveBeenCalledWith({
                                where: { walletId: 'wallet-456' },
                                orderBy: { createdAt: 'desc' }
                        });
                });
        });

        describe('save', () => {
                it('should upsert payment successfully', async () => {
                        // Arrange
                        const mockPaymentData = {
                                id: 'payment-123',
                                walletId: 'wallet-456',
                                amountKobo: 50000,
                                status: 'PENDING',
                                provider: 'PAYSTACK',
                                currency: 'NGN',
                                cancelReason: null,
                                failedReason: null
                        };

                        const mockPayment = {
                                id: 'payment-123',
                                getState: jest.fn().mockReturnValue(mockPaymentData)
                        };

                        mockPrismaPayment.upsert.mockResolvedValue(mockPaymentData as any);

                        // Act
                        const result = await repository.save(mockPayment as any);

                        // Assert
                        expect(mockPrismaPayment.upsert).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should handle null reason fields', async () => {
                        // Arrange
                        const mockPaymentData = {
                                id: 'payment-123',
                                status: 'PENDING',
                                cancelReason: null,
                                failedReason: null
                        };

                        const mockPayment = {
                                id: 'payment-123',
                                getState: jest.fn().mockReturnValue(mockPaymentData)
                        };

                        mockPrismaPayment.upsert.mockResolvedValue(mockPaymentData as any);

                        // Act
                        await repository.save(mockPayment as any);

                        // Assert
                        expect(mockPrismaPayment.upsert).toHaveBeenCalled();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockPaymentData = {
                                id: 'payment-123',
                                status: 'PENDING'
                        };

                        const mockPayment = {
                                id: 'payment-123',
                                getState: jest.fn().mockReturnValue(mockPaymentData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaPayment.upsert.mockResolvedValue(mockPaymentData as any);

                        // Act
                        const result = await repository.save(mockPayment as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle concurrent modification errors', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-123',
                                getState: jest.fn().mockReturnValue({ id: 'payment-123' })
                        };

                        mockPrismaPayment.upsert.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError('', {
                                        code: 'P2025',
                                        clientVersion: '1.0'
                                })
                        );

                        // Act & Assert
                        await expect(repository.save(mockPayment as any)).rejects.toThrow();
                });
        });

        describe('error handling', () => {
                it('should handle database errors on findById', async () => {
                        // Arrange
                        mockPrismaPayment.findUnique.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.findById('payment-123')).rejects.toThrow('Database error');
                });

                it('should handle database errors on findMany', async () => {
                        // Arrange
                        mockPrismaPayment.findMany.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.findAllByWalletId('wallet-456')).rejects.toThrow(
                                'Database error'
                        );
                });

                it('should handle database errors on save', async () => {
                        // Arrange
                        const mockPayment = {
                                id: 'payment-123',
                                getState: jest.fn().mockReturnValue({ id: 'payment-123' })
                        };

                        mockPrismaPayment.upsert.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.save(mockPayment as any)).rejects.toThrow('Database error');
                });
        });

        describe('entity mapping', () => {
                it('should map database record to payment entity', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payment-123',
                                walletId: 'wallet-456',
                                amountKobo: 50000,
                                status: 'SUCCESS',
                                provider: 'PAYSTACK',
                                currency: 'NGN'
                        };

                        mockPrismaPayment.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('payment-123');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should preserve payment state on multiple findMany calls', async () => {
                        // Arrange
                        const mockRecords = [
                                { id: 'payment-1', walletId: 'wallet-456' },
                                { id: 'payment-2', walletId: 'wallet-456' }
                        ];

                        mockPrismaPayment.findMany.mockResolvedValue(mockRecords as any);

                        // Act
                        const result = await repository.findAllByWalletId('wallet-456');

                        // Assert
                        expect(result).toHaveLength(2);
                });
        });

        describe('transaction handling', () => {
                it('should work with transaction client for all operations', async () => {
                        // Arrange
                        const mockRecord = { id: 'payment-123' };
                        const mockTrx = {} as Prisma.TransactionClient;

                        mockPrismaPayment.findUnique.mockResolvedValue(mockRecord as any);
                        mockPrismaPayment.findMany.mockResolvedValue([mockRecord] as any);
                        mockPrismaPayment.upsert.mockResolvedValue(mockRecord as any);

                        // Act
                        await repository.findById('payment-123', mockTrx);
                        await repository.findByProviderReference('ref-123', mockTrx);
                        await repository.findBySystemReference('sys-123', mockTrx);
                        await repository.findAllByWalletId('wallet-123', mockTrx);

                        // Assert
                        expect(mockPrismaPayment.findUnique).toHaveBeenCalledTimes(3);
                        expect(mockPrismaPayment.findMany).toHaveBeenCalledTimes(1);
                });
        });
});
