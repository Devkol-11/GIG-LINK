import { UserRepository } from '../../adapters/UserRepository.js';
import { User } from '../../domain/entities/User.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('UserRepository - UNIT TESTS', () => {
        let repository: UserRepository;
        let mockPrismaUser: jest.Mocked<typeof prismaDbClient.user>;
        let mockPrismaRefreshToken: jest.Mocked<typeof prismaDbClient.refreshToken>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaUser = prismaDbClient.user as jest.Mocked<typeof prismaDbClient.user>;
                mockPrismaRefreshToken = prismaDbClient.refreshToken as jest.Mocked<
                        typeof prismaDbClient.refreshToken
                >;
                repository = new UserRepository();
        });

        describe('save', () => {
                it('should create new user successfully', async () => {
                        // Arrange
                        const mockUserData = {
                                id: 'user-123',
                                email: 'user@example.com',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890',
                                passwordHash: '$2b$10$hashedpassword',
                                role: 'CREATOR',
                                googleId: null,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue(mockUserData)
                        };

                        mockPrismaUser.upsert.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.save(mockUser as any);

                        // Assert
                        expect(mockPrismaUser.upsert).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should update existing user', async () => {
                        // Arrange
                        const mockUserData = {
                                id: 'user-123',
                                email: 'user@example.com',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321',
                                passwordHash: '$2b$10$newhashedpassword',
                                role: 'CREATOR'
                        };

                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue(mockUserData)
                        };

                        mockPrismaUser.upsert.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.save(mockUser as any);

                        // Assert
                        expect(mockPrismaUser.upsert).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const mockUserData = {
                                id: 'user-123',
                                email: 'user@example.com'
                        };

                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue(mockUserData)
                        };

                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaUser.upsert.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.save(mockUser as any, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle database errors on save', async () => {
                        // Arrange
                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue({ id: 'user-123' })
                        };

                        mockPrismaUser.upsert.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.save(mockUser as any)).rejects.toThrow('Database error');
                });
        });

        describe('saveRefreshToken', () => {
                it('should create refresh token successfully', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const token = 'refreshTokenHash123';
                        const expiresAt = new Date();

                        const mockRefreshToken = {
                                id: 'token-123',
                                userId,
                                token,
                                expiresAt
                        };

                        mockPrismaRefreshToken.create.mockResolvedValue(mockRefreshToken as any);

                        // Act
                        const result = await repository.saveRefreshToken(userId, token, expiresAt);

                        // Assert
                        expect(mockPrismaRefreshToken.create).toHaveBeenCalledWith({
                                data: { userId, token, expiresAt }
                        });
                        expect(result).toBeDefined();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const token = 'refreshTokenHash123';
                        const expiresAt = new Date();
                        const mockTrx = {} as Prisma.TransactionClient;

                        mockPrismaRefreshToken.create.mockResolvedValue({} as any);

                        // Act
                        const result = await repository.saveRefreshToken(userId, token, expiresAt, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle database errors on token creation', async () => {
                        // Arrange
                        const userId = 'user-123';
                        mockPrismaRefreshToken.create.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(
                                repository.saveRefreshToken(userId, 'token', new Date())
                        ).rejects.toThrow('Database error');
                });
        });

        describe('invalidateRefreshToken', () => {
                it('should delete refresh tokens for user', async () => {
                        // Arrange
                        const userId = 'user-123';
                        mockPrismaRefreshToken.deleteMany.mockResolvedValue({ count: 1 });

                        // Act
                        await repository.invalidateRefreshToken(userId);

                        // Assert
                        expect(mockPrismaRefreshToken.deleteMany).toHaveBeenCalledWith({
                                where: { id: userId }
                        });
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const mockTrx = {} as Prisma.TransactionClient;
                        mockPrismaRefreshToken.deleteMany.mockResolvedValue({ count: 1 });

                        // Act
                        await repository.invalidateRefreshToken(userId, mockTrx);

                        // Assert
                        expect(mockPrismaRefreshToken.deleteMany).toHaveBeenCalled();
                });
        });

        describe('findByEmail', () => {
                it('should find user by email', async () => {
                        // Arrange
                        const mockUserData = {
                                id: 'user-123',
                                email: 'user@example.com',
                                firstName: 'John',
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockPrismaUser.findUnique.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.findByEmail('user@example.com');

                        // Assert
                        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
                                where: { email: 'user@example.com'.toLowerCase() }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null if user not found', async () => {
                        // Arrange
                        mockPrismaUser.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByEmail('nonexistent@example.com');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should handle case-insensitive email lookup', async () => {
                        // Arrange
                        mockPrismaUser.findUnique.mockResolvedValue({} as any);

                        // Act
                        await repository.findByEmail('USER@EXAMPLE.COM');

                        // Assert
                        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
                                where: { email: 'user@example.com' }
                        });
                });
        });

        describe('findById', () => {
                it('should find user by id', async () => {
                        // Arrange
                        const mockUserData = {
                                id: 'user-123',
                                email: 'user@example.com',
                                firstName: 'John'
                        };

                        mockPrismaUser.findUnique.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.findById('user-123');

                        // Assert
                        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
                                where: { id: 'user-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null if user not found', async () => {
                        // Arrange
                        mockPrismaUser.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findById('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('findByGoogleId', () => {
                it('should find user by google id', async () => {
                        // Arrange
                        const mockUserData = {
                                id: 'user-123',
                                email: 'user@example.com',
                                googleId: 'google-123'
                        };

                        mockPrismaUser.findUnique.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.findByGoogleId('google-123');

                        // Assert
                        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
                                where: { googleId: 'google-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null if google id not found', async () => {
                        // Arrange
                        mockPrismaUser.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByGoogleId('non-existent-google-id');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('updateGoogleId', () => {
                it('should update google id for user', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const googleId = 'google-123';
                        const mockUserData = {
                                id: userId,
                                email: 'user@example.com',
                                googleId
                        };

                        mockPrismaUser.update.mockResolvedValue(mockUserData as any);

                        // Act
                        const result = await repository.updateGoogleId(userId, googleId);

                        // Assert
                        expect(mockPrismaUser.update).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should use transaction client if provided', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const googleId = 'google-123';
                        const mockTrx = {} as Prisma.TransactionClient;

                        mockPrismaUser.update.mockResolvedValue({} as any);

                        // Act
                        const result = await repository.updateGoogleId(userId, googleId, mockTrx);

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should return null if user not found', async () => {
                        // Arrange
                        mockPrismaUser.update.mockResolvedValue(null);

                        // Act
                        const result = await repository.updateGoogleId('user-123', 'google-123');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('error handling', () => {
                it('should handle database connection errors', async () => {
                        // Arrange
                        mockPrismaUser.findUnique.mockRejectedValue(new Error('Connection error'));

                        // Act & Assert
                        await expect(repository.findById('user-123')).rejects.toThrow('Connection error');
                });

                it('should handle constraint violations', async () => {
                        // Arrange
                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue({ id: 'user-123' })
                        };

                        mockPrismaUser.upsert.mockRejectedValue(
                                new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                                        code: 'P2002',
                                        clientVersion: '1.0'
                                })
                        );

                        // Act & Assert
                        await expect(repository.save(mockUser as any)).rejects.toThrow();
                });
        });

        describe('transaction handling', () => {
                it('should support transaction client in all methods', async () => {
                        // Arrange
                        const mockTrx = {} as Prisma.TransactionClient;

                        mockPrismaUser.upsert.mockResolvedValue({} as any);
                        mockPrismaRefreshToken.create.mockResolvedValue({} as any);
                        mockPrismaRefreshToken.deleteMany.mockResolvedValue({ count: 0 });

                        // Act
                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue({ id: 'user-123' })
                        };

                        await repository.save(mockUser as any, mockTrx);
                        await repository.saveRefreshToken('user-123', 'token', new Date(), mockTrx);
                        await repository.invalidateRefreshToken('user-123', mockTrx);

                        // Assert
                        expect(mockPrismaUser.upsert).toHaveBeenCalled();
                        expect(mockPrismaRefreshToken.create).toHaveBeenCalled();
                        expect(mockPrismaRefreshToken.deleteMany).toHaveBeenCalled();
                });
        });
});
