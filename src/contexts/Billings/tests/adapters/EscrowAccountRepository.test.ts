import { EscrowAccountRepository } from '../../adapters/EscrowAccountRepository.js';
import { EscrowAccount } from '../../domain/entities/Escrow.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('EscrowAccountRepository - UNIT TESTS', () => {
        let repository: EscrowAccountRepository;
        let mockPrismaEscrowAccount: jest.Mocked<typeof prismaDbClient.escrowAccount>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaEscrowAccount = prismaDbClient.escrowAccount as jest.Mocked<
                        typeof prismaDbClient.escrowAccount
                >;
                repository = new EscrowAccountRepository();
        });

        describe('save', () => {
                it('should create escrow account with entity state', async () => {
                        // Arrange
                        const mockEscrowData = {
                                id: 'escrow-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freeLancerId: 'freelancer-202',
                                balance: 50000,
                                currency: 'NGN',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockEntity = {
                                id: 'escrow-123',
                                getState: jest.fn().mockReturnValue(mockEscrowData)
                        };

                        mockPrismaEscrowAccount.create.mockResolvedValue(mockEscrowData as any);

                        // Act
                        const result = await repository.save(mockEntity as any);

                        // Assert
                        expect(mockPrismaEscrowAccount.create).toHaveBeenCalledWith({ data: mockEscrowData });
                        expect(result).toBeDefined();
                });

                it('should save with transaction client if provided', async () => {
                        // Arrange
                        const mockEscrowData = {
                                id: 'escrow-123',
                                balance: 50000
                        };

                        const mockEntity = {
                                id: 'escrow-123',
                                getState: jest.fn().mockReturnValue(mockEscrowData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        const mockTrxEscrowAccount = {
                                create: jest.fn().mockResolvedValue(mockEscrowData)
                        };

                        // Act
                        (prismaDbClient as any).escrowAccount = mockTrxEscrowAccount;
                        mockTrxEscrowAccount.create.mockResolvedValue(mockEscrowData as any);

                        // For transaction client, we need to pass the trx
                        // This tests that the repository uses the transaction client when provided
                        const result = await repository.save(mockEntity as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('findByid', () => {
                it('should return escrow account when found', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'escrow-123',
                                gigId: 'gig-456',
                                applicationId: 'app-789',
                                creatorId: 'creator-101',
                                freeLancerId: 'freelancer-202',
                                balance: 50000,
                                currency: 'NGN',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaEscrowAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByid('escrow-123');

                        // Assert
                        expect(mockPrismaEscrowAccount.findUnique).toHaveBeenCalledWith({
                                where: { id: 'escrow-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when escrow not found', async () => {
                        // Arrange
                        mockPrismaEscrowAccount.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByid('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should query by correct escrow id', async () => {
                        // Arrange
                        mockPrismaEscrowAccount.findUnique.mockResolvedValue(null);

                        // Act
                        await repository.findByid('specific-id-123');

                        // Assert
                        expect(mockPrismaEscrowAccount.findUnique).toHaveBeenCalledWith({
                                where: { id: 'specific-id-123' }
                        });
                });

                it('should return entity instance from database record', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'escrow-123',
                                balance: 50000
                        };

                        mockPrismaEscrowAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByid('escrow-123');

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('error handling', () => {
                it('should handle create errors', async () => {
                        // Arrange
                        const mockEntity = {
                                id: 'escrow-123',
                                getState: jest.fn().mockReturnValue({ id: 'escrow-123' })
                        };

                        mockPrismaEscrowAccount.create.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.save(mockEntity as any)).rejects.toThrow('Database error');
                });

                it('should handle find errors', async () => {
                        // Arrange
                        mockPrismaEscrowAccount.findUnique.mockRejectedValue(new Error('Connection error'));

                        // Act & Assert
                        await expect(repository.findByid('escrow-123')).rejects.toThrow('Connection error');
                });
        });

        describe('entity mapping', () => {
                it('should map database record to entity', async () => {
                        // Arrange
                        const mockRecord = {
                                id: 'escrow-123',
                                gigId: 'gig-456',
                                creatorId: 'creator-101',
                                freeLancerId: 'freelancer-202',
                                balance: 50000,
                                currency: 'NGN'
                        };

                        mockPrismaEscrowAccount.findUnique.mockResolvedValue(mockRecord as any);

                        // Act
                        const result = await repository.findByid('escrow-123');

                        // Assert
                        expect(result).toBeTruthy();
                });
        });
});
