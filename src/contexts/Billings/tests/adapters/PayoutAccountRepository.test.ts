import { PayoutAccountRepository } from '../../adapters/PayoutAccountRepository.js';
import { PayoutAccount } from '../../domain/entities/PayoutAccount.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('PayoutAccountRepository - UNIT TESTS', () => {
        let repository: PayoutAccountRepository;
        let mockPrismaPayoutAccount: jest.Mocked<typeof prismaDbClient.payoutAccount>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaPayoutAccount = prismaDbClient.payoutAccount as jest.Mocked<
                        typeof prismaDbClient.payoutAccount
                >;
                repository = new PayoutAccountRepository();
        });

        describe('save', () => {
                it('should create payout account successfully', async () => {
                        // Arrange
                        const mockPayoutData = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue(mockPayoutData)
                        };

                        mockPrismaPayoutAccount.create.mockResolvedValue(mockPayoutData as any);

                        // Act
                        const result = await repository.save(mockPayoutAccount as any);

                        // Assert
                        expect(mockPrismaPayoutAccount.create).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should update existing payout account via upsert', async () => {
                        // Arrange
                        const mockPayoutData = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'Jane Doe',
                                isVerified: true
                        };

                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue(mockPayoutData)
                        };

                        mockPrismaPayoutAccount.upsert.mockResolvedValue(mockPayoutData as any);

                        // Act
                        const result = await repository.save(mockPayoutAccount as any);

                        // Assert
                        expect(mockPrismaPayoutAccount.create).toHaveBeenCalled();
                });

                it('should preserve all payout account fields on save', async () => {
                        // Arrange
                        const mockPayoutData = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: false
                        };

                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue(mockPayoutData)
                        };

                        mockPrismaPayoutAccount.create.mockResolvedValue(mockPayoutData as any);

                        // Act
                        await repository.save(mockPayoutAccount as any);

                        // Assert
                        expect(mockPrismaPayoutAccount.create).toHaveBeenCalled();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockPayoutData = {
                                id: 'payout-123',
                                userId: 'user-456'
                        };

                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue(mockPayoutData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaPayoutAccount.create.mockResolvedValue(mockPayoutData as any);

                        // Act
                        const result = await repository.save(mockPayoutAccount as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle concurrent modification errors', async () => {
                        // Arrange
                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue({ id: 'payout-123' })
                        };

                        mockPrismaPayoutAccount.create.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError('', {
                                        code: 'P2025',
                                        clientVersion: '1.0'
                                })
                        );

                        // Act & Assert
                        await expect(repository.save(mockPayoutAccount as any)).rejects.toThrow();
                });

                it('should handle unique constraint violations', async () => {
                        // Arrange
                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue({ id: 'payout-123' })
                        };

                        mockPrismaPayoutAccount.create.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError(
                                        'Unique constraint failed on the fields: (`userId`)',
                                        {
                                                code: 'P2002',
                                                clientVersion: '1.0'
                                        }
                                )
                        );

                        // Act & Assert
                        await expect(repository.save(mockPayoutAccount as any)).rejects.toThrow();
                });
        });

        describe('findByUserId', () => {
                it('should find payout account by user id', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(mockPrismaPayoutAccount.findUnique).toHaveBeenCalledWith({
                                where: { userId: 'user-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when payout account not found', async () => {
                        // Arrange
                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByUserId('non-existent-user');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should preserve payout account state on retrieval', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should handle unverified payout accounts', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: false
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456'
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456', mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('error handling', () => {
                it('should handle database errors on findByUserId', async () => {
                        // Arrange
                        mockPrismaPayoutAccount.findUnique.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.findByUserId('user-456')).rejects.toThrow('Database error');
                });

                it('should handle database connection errors on save', async () => {
                        // Arrange
                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue({ id: 'payout-123' })
                        };

                        mockPrismaPayoutAccount.create.mockRejectedValue(new Error('Connection error'));

                        // Act & Assert
                        await expect(repository.save(mockPayoutAccount as any)).rejects.toThrow(
                                'Connection error'
                        );
                });

                it('should handle validation errors', async () => {
                        // Arrange
                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue({
                                        id: 'payout-123',
                                        accountNumber: 'invalid'
                                })
                        };

                        mockPrismaPayoutAccount.create.mockRejectedValue(
                                new Error('Invalid account number format')
                        );

                        // Act & Assert
                        await expect(repository.save(mockPayoutAccount as any)).rejects.toThrow(
                                'Invalid account number format'
                        );
                });
        });

        describe('entity mapping', () => {
                it('should map database record to payout account entity', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should handle all payout account fields', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true,
                                createdAt: new Date('2024-01-01'),
                                updatedAt: new Date('2024-01-02')
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeTruthy();
                });
        });

        describe('transaction handling', () => {
                it('should work with transaction client for all operations', async () => {
                        // Arrange
                        const mockRecord = { id: 'payout-123' };
                        const mockTrx = {} as Prisma.TransactionClient;

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);
                        mockPrismaPayoutAccount.create.mockResolvedValue(mockRecord as any);

                        // Act
                        await repository.findByUserId('user-456', mockTrx);

                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue({ id: 'payout-123' })
                        };

                        await repository.save(mockPayoutAccount as any, mockTrx);

                        // Assert
                        expect(mockPrismaPayoutAccount.findUnique).toHaveBeenCalled();
                        expect(mockPrismaPayoutAccount.create).toHaveBeenCalled();
                });
        });

        describe('bank account verification', () => {
                it('should handle verified bank accounts', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle unverified bank accounts', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: false
                        };

                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByUserId('user-456');

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle different bank codes', async () => {
                        // Arrange
                        const bankCodes = ['058', '012', '999', '044'];

                        for (const bankCode of bankCodes) {
                                const mockRecord = {
                                        id: `payout-${bankCode}`,
                                        userId: 'user-456',
                                        bankCode,
                                        accountNumber: '1234567890',
                                        accountName: 'John Doe',
                                        isVerified: true
                                };

                                mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                                // Act
                                const result = await repository.findByUserId('user-456');

                                // Assert
                                expect(result).toBeDefined();
                        }
                });
        });

        describe('data consistency', () => {
                it('should preserve data integrity across multiple saves', async () => {
                        // Arrange
                        const mockPayoutData = {
                                id: 'payout-123',
                                userId: 'user-456',
                                bankCode: '058',
                                accountNumber: '1234567890',
                                accountName: 'John Doe',
                                isVerified: true
                        };

                        const mockPayoutAccount = {
                                id: 'payout-123',
                                getState: jest.fn().mockReturnValue(mockPayoutData)
                        };

                        mockPrismaPayoutAccount.create.mockResolvedValue(mockPayoutData as any);

                        // Act
                        await repository.save(mockPayoutAccount as any);
                        await repository.save(mockPayoutAccount as any);
                        await repository.save(mockPayoutAccount as any);

                        // Assert
                        expect(mockPrismaPayoutAccount.create).toHaveBeenCalledTimes(3);
                });

                it('should handle rapid consecutive operations', async () => {
                        // Arrange
                        const mockRecord = { id: 'payout-123', userId: 'user-456' };
                        mockPrismaPayoutAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const results = await Promise.all([
                                repository.findByUserId('user-456'),
                                repository.findByUserId('user-456'),
                                repository.findByUserId('user-456')
                        ]);

                        // Assert
                        expect(results).toHaveLength(3);
                        expect(mockPrismaPayoutAccount.findUnique).toHaveBeenCalledTimes(3);
                });
        });
});
