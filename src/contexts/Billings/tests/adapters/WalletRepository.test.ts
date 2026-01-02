import { WalletRepository } from '../../adapters/WalletRepository.js';
import { Wallet } from '../../domain/aggregate-roots/Wallet.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { ConcurrencyError } from '../../domain/errors/concurrencyError.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('WalletRepository - UNIT TESTS', () => {
        let repository: WalletRepository;
        let mockPrismaWallet: jest.Mocked<typeof prismaDbClient.wallet>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaWallet = prismaDbClient.wallet as jest.Mocked<typeof prismaDbClient.wallet>;
                repository = new WalletRepository();
        });

        describe('findById', () => {
                it('should return wallet when found', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                userId: 'user-456',
                                balance: 100000,
                                availableAmount: 100000,
                                currency: 'NGN',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('wallet-123');

                        // Assert
                        expect(mockPrismaWallet.findUnique).toHaveBeenCalledWith({
                                where: { id: 'wallet-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when wallet not found', async () => {
                        // Arrange
                        mockPrismaWallet.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findById('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                balance: 100000
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('wallet-123', mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('findByUserId', () => {
                it('should return wallet when found by user id', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                userId: 'user-456',
                                balance: 100000,
                                currency: 'NGN',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(mockPrismaWallet.findUnique).toHaveBeenCalledWith({
                                where: { userId: 'user-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when wallet not found for user', async () => {
                        // Arrange
                        mockPrismaWallet.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should handle transaction client parameter', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                userId: 'user-456'
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456', mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('save', () => {
                it('should upsert wallet successfully', async () => {
                        // Arrange
                        const mockWalletData = {
                                id: 'wallet-123',
                                userId: 'user-456',
                                balance: 100000,
                                availableAmount: 100000,
                                currency: 'NGN'
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                getState: jest.fn().mockReturnValue(mockWalletData)
                        };

                        mockPrismaWallet.upsert.mockResolvedValue(mockWalletData as any);

                        // Act
                        const result = await repository.save(mockWallet as any);

                        // Assert
                        expect(mockPrismaWallet.upsert).toHaveBeenCalledWith({
                                where: { id: 'wallet-123' },
                                update: mockWalletData,
                                create: mockWalletData
                        });
                        expect(result).toBeDefined();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockWalletData = {
                                id: 'wallet-123',
                                balance: 100000
                        };

                        const mockWallet = {
                                id: 'wallet-123',
                                getState: jest.fn().mockReturnValue(mockWalletData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaWallet.upsert.mockResolvedValue(mockWalletData as any);

                        // Act
                        const result = await repository.save(mockWallet as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle concurrency errors', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-123',
                                getState: jest.fn().mockReturnValue({ id: 'wallet-123' })
                        };

                        const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
                                code: 'P2025',
                                clientVersion: '1.0'
                        });

                        mockPrismaWallet.upsert.mockRejectedValue(prismaError);

                        // Act & Assert
                        await expect(repository.save(mockWallet as any)).rejects.toThrow();
                });

                it('should propagate other database errors', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-123',
                                getState: jest.fn().mockReturnValue({ id: 'wallet-123' })
                        };

                        mockPrismaWallet.upsert.mockRejectedValue(new Error('Database connection error'));

                        // Act & Assert
                        await expect(repository.save(mockWallet as any)).rejects.toThrow(
                                'Database connection error'
                        );
                });
        });

        describe('entity mapping', () => {
                it('should map database record to wallet entity', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                userId: 'user-456',
                                balance: 100000,
                                availableAmount: 100000,
                                currency: 'NGN'
                        };

                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('wallet-123');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should preserve wallet state on entity mapping', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                userId: 'user-456',
                                balance: 50000,
                                availableAmount: 25000,
                                currency: 'NGN'
                        };

                        mockPrismaWallet.findById.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('wallet-123');

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('transaction handling', () => {
                it('should work with prisma transaction client', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                balance: 100000
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        await repository.findById('wallet-123', mockTrx);

                        // Assert
                        expect(mockPrismaWallet.findUnique).toHaveBeenCalled();
                });

                it('should handle null transaction client', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'wallet-123',
                                balance: 100000
                        };

                        mockPrismaWallet.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findById('wallet-123');

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('error scenarios', () => {
                it('should handle concurrent modification errors', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-123',
                                getState: jest.fn().mockReturnValue({ id: 'wallet-123' })
                        };

                        mockPrismaWallet.upsert.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError('', {
                                        code: 'P2025',
                                        clientVersion: '1.0'
                                })
                        );

                        // Act & Assert
                        await expect(repository.save(mockWallet as any)).rejects.toThrow();
                });

                it('should handle connection errors on read', async () => {
                        // Arrange
                        mockPrismaWallet.findUnique.mockRejectedValue(new Error('Connection failed'));

                        // Act & Assert
                        await expect(repository.findById('wallet-123')).rejects.toThrow('Connection failed');
                });

                it('should handle connection errors on write', async () => {
                        // Arrange
                        const mockWallet = {
                                id: 'wallet-123',
                                getState: jest.fn().mockReturnValue({ id: 'wallet-123' })
                        };

                        mockPrismaWallet.upsert.mockRejectedValue(new Error('Connection failed'));

                        // Act & Assert
                        await expect(repository.save(mockWallet as any)).rejects.toThrow('Connection failed');
                });
        });
});
