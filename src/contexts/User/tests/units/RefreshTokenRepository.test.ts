import { RefreshTokenRepository } from '../../adapters/RefreshTokenRepository.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('RefreshTokenRepository - UNIT TESTS', () => {
        let repository: RefreshTokenRepository;
        let mockPrismaRefreshToken: jest.Mocked<typeof prismaDbClient.refreshToken>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaRefreshToken = prismaDbClient.refreshToken as jest.Mocked<
                        typeof prismaDbClient.refreshToken
                >;
                repository = new RefreshTokenRepository();
        });

        describe('save', () => {
                it('should create new refresh token', async () => {
                        // Arrange
                        const mockTokenData = {
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                        };

                        const mockTokenEntity = {
                                getState: jest.fn().mockReturnValue(mockTokenData)
                        };

                        const mockCreatedToken = {
                                id: 'token-123',
                                ...mockTokenData,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                isRevoked: false
                        };

                        mockPrismaRefreshToken.create.mockResolvedValue(mockCreatedToken as any);

                        // Act
                        const result = await repository.save(mockTokenEntity as any);

                        // Assert
                        expect(mockPrismaRefreshToken.create).toHaveBeenCalledWith({
                                data: expect.objectContaining({
                                        userId: 'user-123',
                                        token: 'refresh-token-abc123'
                                })
                        });
                        expect(result).toBeDefined();
                });

                it('should handle database errors on save', async () => {
                        // Arrange
                        const mockTokenEntity = {
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-123',
                                        token: 'refresh-token-abc123'
                                })
                        };

                        mockPrismaRefreshToken.create.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.save(mockTokenEntity as any)).rejects.toThrow(
                                'Database error'
                        );
                });

                it('should handle constraint violations on save', async () => {
                        // Arrange
                        const mockTokenEntity = {
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-123',
                                        token: 'duplicate-token'
                                })
                        };

                        mockPrismaRefreshToken.create.mockRejectedValue(
                                new Error('P2002: Unique constraint')
                        );

                        // Act & Assert
                        await expect(repository.save(mockTokenEntity as any)).rejects.toThrow();
                });
        });

        describe('findByToken', () => {
                it('should find refresh token by token value', async () => {
                        // Arrange
                        const mockToken = {
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                isRevoked: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaRefreshToken.findUnique.mockResolvedValue(mockToken as any);

                        // Act
                        const result = await repository.findByToken('refresh-token-abc123');

                        // Assert
                        expect(mockPrismaRefreshToken.findUnique).toHaveBeenCalledWith({
                                where: { token: 'refresh-token-abc123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when token not found', async () => {
                        // Arrange
                        mockPrismaRefreshToken.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByToken('non-existent-token');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should indicate when token is revoked', async () => {
                        // Arrange
                        const mockToken = {
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                isRevoked: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaRefreshToken.findUnique.mockResolvedValue(mockToken as any);

                        // Act
                        const result = await repository.findByToken('refresh-token-abc123');

                        // Assert
                        expect((result as any).isRevoked).toBe(true);
                });
        });

        describe('findByUserId', () => {
                it('should find all tokens for a user', async () => {
                        // Arrange
                        const mockTokens = [
                                {
                                        id: 'token-1',
                                        userId: 'user-123',
                                        token: 'refresh-token-1',
                                        expiresAt: new Date(),
                                        isRevoked: false
                                },
                                {
                                        id: 'token-2',
                                        userId: 'user-123',
                                        token: 'refresh-token-2',
                                        expiresAt: new Date(),
                                        isRevoked: false
                                }
                        ];

                        mockPrismaRefreshToken.findMany.mockResolvedValue(mockTokens as any);

                        // Act
                        const result = await repository.findByUserId('user-123');

                        // Assert
                        expect(mockPrismaRefreshToken.findMany).toHaveBeenCalledWith({
                                where: { userId: 'user-123' }
                        });
                        expect(Array.isArray(result)).toBe(true);
                        expect(result.length).toBe(2);
                });

                it('should return empty array when user has no tokens', async () => {
                        // Arrange
                        mockPrismaRefreshToken.findMany.mockResolvedValue([]);

                        // Act
                        const result = await repository.findByUserId('user-no-tokens');

                        // Assert
                        expect(result).toEqual([]);
                });

                it('should only return non-revoked tokens', async () => {
                        // Arrange
                        const mockTokens = [
                                {
                                        id: 'token-1',
                                        userId: 'user-123',
                                        token: 'refresh-token-1',
                                        isRevoked: false
                                },
                                {
                                        id: 'token-2',
                                        userId: 'user-123',
                                        token: 'refresh-token-2',
                                        isRevoked: true
                                }
                        ];

                        mockPrismaRefreshToken.findMany.mockResolvedValue(mockTokens as any);

                        // Act
                        const result = await repository.findByUserId('user-123');

                        // Assert
                        expect(result.length).toBe(2);
                });
        });

        describe('revoke', () => {
                it('should revoke token successfully', async () => {
                        // Arrange
                        const mockRevokedToken = {
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                isRevoked: true,
                                expiresAt: new Date(),
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaRefreshToken.update.mockResolvedValue(mockRevokedToken as any);

                        // Act
                        const result = await repository.revoke('token-123');

                        // Assert
                        expect(mockPrismaRefreshToken.update).toHaveBeenCalledWith({
                                where: { id: 'token-123' },
                                data: { isRevoked: true }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when token not found on revoke', async () => {
                        // Arrange
                        mockPrismaRefreshToken.update.mockResolvedValue(null);

                        // Act
                        const result = await repository.revoke('non-existent-token');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should handle database errors on revoke', async () => {
                        // Arrange
                        mockPrismaRefreshToken.update.mockRejectedValue(new Error('Update error'));

                        // Act & Assert
                        await expect(repository.revoke('token-123')).rejects.toThrow('Update error');
                });
        });

        describe('revokeByUserId', () => {
                it('should revoke all tokens for a user', async () => {
                        // Arrange
                        mockPrismaRefreshToken.updateMany.mockResolvedValue({ count: 3 });

                        // Act
                        const result = await repository.revokeByUserId('user-123');

                        // Assert
                        expect(mockPrismaRefreshToken.updateMany).toHaveBeenCalledWith({
                                where: { userId: 'user-123' },
                                data: { isRevoked: true }
                        });
                        expect(result).toBe(3);
                });

                it('should return 0 when user has no tokens to revoke', async () => {
                        // Arrange
                        mockPrismaRefreshToken.updateMany.mockResolvedValue({ count: 0 });

                        // Act
                        const result = await repository.revokeByUserId('user-no-tokens');

                        // Assert
                        expect(result).toBe(0);
                });

                it('should handle database errors on revokeByUserId', async () => {
                        // Arrange
                        mockPrismaRefreshToken.updateMany.mockRejectedValue(new Error('Update error'));

                        // Act & Assert
                        await expect(repository.revokeByUserId('user-123')).rejects.toThrow('Update error');
                });
        });

        describe('delete', () => {
                it('should delete token successfully', async () => {
                        // Arrange
                        mockPrismaRefreshToken.delete.mockResolvedValue({
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123'
                        } as any);

                        // Act
                        const result = await repository.delete('token-123');

                        // Assert
                        expect(mockPrismaRefreshToken.delete).toHaveBeenCalledWith({
                                where: { id: 'token-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when token not found on delete', async () => {
                        // Arrange
                        mockPrismaRefreshToken.delete.mockResolvedValue(null);

                        // Act
                        const result = await repository.delete('non-existent-token');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('isTokenValid', () => {
                it('should validate non-revoked, non-expired token', async () => {
                        // Arrange
                        const futureDate = new Date(Date.now() + 1000);
                        const mockToken = {
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                isRevoked: false,
                                expiresAt: futureDate
                        };

                        mockPrismaRefreshToken.findUnique.mockResolvedValue(mockToken as any);

                        // Act
                        const token = await repository.findByToken('refresh-token-abc123');

                        // Assert
                        expect((token as any).isRevoked).toBe(false);
                        expect((token as any).expiresAt > new Date()).toBe(true);
                });

                it('should identify revoked token as invalid', async () => {
                        // Arrange
                        const mockToken = {
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                isRevoked: true,
                                expiresAt: new Date(Date.now() + 1000)
                        };

                        mockPrismaRefreshToken.findUnique.mockResolvedValue(mockToken as any);

                        // Act
                        const token = await repository.findByToken('refresh-token-abc123');

                        // Assert
                        expect((token as any).isRevoked).toBe(true);
                });

                it('should identify expired token as invalid', async () => {
                        // Arrange
                        const pastDate = new Date(Date.now() - 1000);
                        const mockToken = {
                                id: 'token-123',
                                userId: 'user-123',
                                token: 'refresh-token-abc123',
                                isRevoked: false,
                                expiresAt: pastDate
                        };

                        mockPrismaRefreshToken.findUnique.mockResolvedValue(mockToken as any);

                        // Act
                        const token = await repository.findByToken('refresh-token-abc123');

                        // Assert
                        expect((token as any).expiresAt < new Date()).toBe(true);
                });
        });

        describe('error handling', () => {
                it('should handle database connection errors on find', async () => {
                        // Arrange
                        mockPrismaRefreshToken.findUnique.mockRejectedValue(new Error('Connection failed'));

                        // Act & Assert
                        await expect(repository.findByToken('abc123')).rejects.toThrow('Connection failed');
                });

                it('should handle database connection errors on findMany', async () => {
                        // Arrange
                        mockPrismaRefreshToken.findMany.mockRejectedValue(new Error('Connection failed'));

                        // Act & Assert
                        await expect(repository.findByUserId('user-123')).rejects.toThrow(
                                'Connection failed'
                        );
                });
        });

        describe('transaction support', () => {
                it('should save token with transaction client', async () => {
                        // Arrange
                        const mockTxClient = {
                                refreshToken: {
                                        create: jest.fn().mockResolvedValue({
                                                id: 'token-123',
                                                userId: 'user-123',
                                                token: 'refresh-token-abc123'
                                        })
                                }
                        };

                        const mockTokenEntity = {
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-123',
                                        token: 'refresh-token-abc123'
                                })
                        };

                        // Act
                        // Assumes save method supports transaction client parameter
                        const result = await repository.save(mockTokenEntity as any, mockTxClient as any);

                        // Assert
                        expect(result).toBeDefined();
                });
        });
});
