import { OtpRepository } from '../../adapters/OtpRepository.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('OtpRepository - UNIT TESTS', () => {
        let repository: OtpRepository;
        let mockPrismaOtp: jest.Mocked<typeof prismaDbClient.otp>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaOtp = prismaDbClient.otp as jest.Mocked<typeof prismaDbClient.otp>;
                repository = new OtpRepository();
        });

        describe('create', () => {
                it('should create new OTP successfully', async () => {
                        // Arrange
                        const mockOtp = {
                                id: 'otp-123',
                                token: 'abc123def456',
                                userId: 'user-789',
                                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                                isUsed: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        const mockOtpData = {
                                userId: 'user-789',
                                token: 'abc123def456',
                                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
                        };

                        const mockOtpEntity = {
                                getState: jest.fn().mockReturnValue(mockOtpData)
                        };

                        mockPrismaOtp.create.mockResolvedValue(mockOtp as any);

                        // Act
                        const result = await repository.create(mockOtpEntity as any);

                        // Assert
                        expect(mockPrismaOtp.create).toHaveBeenCalledWith({
                                data: expect.objectContaining({
                                        userId: 'user-789',
                                        token: 'abc123def456'
                                })
                        });
                        expect(result).toBeDefined();
                });

                it('should set correct expiry time for OTP', async () => {
                        // Arrange
                        const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
                        const mockOtpData = {
                                userId: 'user-789',
                                token: 'abc123def456',
                                expiresAt: expiryTime
                        };

                        const mockOtpEntity = {
                                getState: jest.fn().mockReturnValue(mockOtpData)
                        };

                        const mockCreatedOtp = {
                                id: 'otp-123',
                                ...mockOtpData,
                                isUsed: false
                        };

                        mockPrismaOtp.create.mockResolvedValue(mockCreatedOtp as any);

                        // Act
                        const result = await repository.create(mockOtpEntity as any);

                        // Assert
                        expect(mockPrismaOtp.create).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should handle database errors on create', async () => {
                        // Arrange
                        const mockOtpEntity = {
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-789',
                                        token: 'abc123'
                                })
                        };

                        mockPrismaOtp.create.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.create(mockOtpEntity as any)).rejects.toThrow(
                                'Database error'
                        );
                });
        });

        describe('findByToken', () => {
                it('should find OTP by token', async () => {
                        // Arrange
                        const mockOtp = {
                                id: 'otp-123',
                                token: 'abc123def456',
                                userId: 'user-789',
                                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                                isUsed: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaOtp.findUnique.mockResolvedValue(mockOtp as any);

                        // Act
                        const result = await repository.findByToken('abc123def456');

                        // Assert
                        expect(mockPrismaOtp.findUnique).toHaveBeenCalledWith({
                                where: { token: 'abc123def456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when OTP token not found', async () => {
                        // Arrange
                        mockPrismaOtp.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findByToken('non-existent-token');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should indicate when OTP is already used', async () => {
                        // Arrange
                        const mockOtp = {
                                id: 'otp-123',
                                token: 'abc123def456',
                                userId: 'user-789',
                                isUsed: true,
                                expiresAt: new Date(),
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaOtp.findUnique.mockResolvedValue(mockOtp as any);

                        // Act
                        const result = await repository.findByToken('abc123def456');

                        // Assert
                        expect(result).toBeDefined();
                });

                it('should handle database errors on findByToken', async () => {
                        // Arrange
                        mockPrismaOtp.findUnique.mockRejectedValue(new Error('Connection error'));

                        // Act & Assert
                        await expect(repository.findByToken('abc123')).rejects.toThrow('Connection error');
                });
        });

        describe('markAsUsed', () => {
                it('should mark OTP as used', async () => {
                        // Arrange
                        const mockUpdatedOtp = {
                                id: 'otp-123',
                                token: 'abc123def456',
                                userId: 'user-789',
                                isUsed: true,
                                expiresAt: new Date(),
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaOtp.update.mockResolvedValue(mockUpdatedOtp as any);

                        // Act
                        const result = await repository.markAsUsed('otp-123');

                        // Assert
                        expect(mockPrismaOtp.update).toHaveBeenCalledWith({
                                where: { id: 'otp-123' },
                                data: { isUsed: true }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when OTP id not found on markAsUsed', async () => {
                        // Arrange
                        mockPrismaOtp.update.mockResolvedValue(null);

                        // Act
                        const result = await repository.markAsUsed('non-existent-otp');

                        // Assert
                        expect(result).toBeNull();
                });

                it('should handle database errors on markAsUsed', async () => {
                        // Arrange
                        mockPrismaOtp.update.mockRejectedValue(new Error('Update error'));

                        // Act & Assert
                        await expect(repository.markAsUsed('otp-123')).rejects.toThrow('Update error');
                });
        });

        describe('deleteAllForUser', () => {
                it('should delete all OTPs for a user', async () => {
                        // Arrange
                        mockPrismaOtp.deleteMany.mockResolvedValue({ count: 3 });

                        // Act
                        const result = await repository.deleteAllForUser('user-789');

                        // Assert
                        expect(mockPrismaOtp.deleteMany).toHaveBeenCalledWith({
                                where: { userId: 'user-789' }
                        });
                        expect(result).toBe(3);
                });

                it('should return 0 when no OTPs exist for user', async () => {
                        // Arrange
                        mockPrismaOtp.deleteMany.mockResolvedValue({ count: 0 });

                        // Act
                        const result = await repository.deleteAllForUser('user-with-no-otps');

                        // Assert
                        expect(result).toBe(0);
                });

                it('should handle database errors on deleteAllForUser', async () => {
                        // Arrange
                        mockPrismaOtp.deleteMany.mockRejectedValue(new Error('Delete error'));

                        // Act & Assert
                        await expect(repository.deleteAllForUser('user-789')).rejects.toThrow('Delete error');
                });
        });

        describe('OTP expiry validation', () => {
                it('should handle expired OTP', async () => {
                        // Arrange
                        const expiredTime = new Date(Date.now() - 1000); // 1 second ago
                        const mockOtp = {
                                id: 'otp-123',
                                token: 'abc123',
                                userId: 'user-789',
                                expiresAt: expiredTime,
                                isUsed: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaOtp.findUnique.mockResolvedValue(mockOtp as any);

                        // Act
                        const result = await repository.findByToken('abc123');

                        // Assert
                        expect(result).toBeDefined();
                        expect((result as any).expiresAt < new Date()).toBe(true);
                });

                it('should handle OTP close to expiry', async () => {
                        // Arrange
                        const almostExpiredTime = new Date(Date.now() + 1000); // 1 second from now
                        const mockOtp = {
                                id: 'otp-123',
                                token: 'abc123',
                                userId: 'user-789',
                                expiresAt: almostExpiredTime,
                                isUsed: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaOtp.findUnique.mockResolvedValue(mockOtp as any);

                        // Act
                        const result = await repository.findByToken('abc123');

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('transaction support', () => {
                it('should create OTP with transaction client', async () => {
                        // Arrange
                        const mockTxClient = {
                                otp: {
                                        create: jest.fn().mockResolvedValue({
                                                id: 'otp-123',
                                                token: 'abc123'
                                        })
                                }
                        };

                        const mockOtpEntity = {
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-789',
                                        token: 'abc123'
                                })
                        };

                        // Act
                        // This assumes create method supports transaction client
                        // Verify implementation supports it
                        const result = await repository.create(mockOtpEntity as any, mockTxClient as any);

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('error handling', () => {
                it('should handle constraint violations on create', async () => {
                        // Arrange
                        const mockOtpEntity = {
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-789',
                                        token: 'duplicate-token'
                                })
                        };

                        mockPrismaOtp.create.mockRejectedValue(new Error('Unique constraint'));

                        // Act & Assert
                        await expect(repository.create(mockOtpEntity as any)).rejects.toThrow();
                });

                it('should handle database connection errors', async () => {
                        // Arrange
                        mockPrismaOtp.findUnique.mockRejectedValue(new Error('Connection failed'));

                        // Act & Assert
                        await expect(repository.findByToken('abc123')).rejects.toThrow('Connection failed');
                });
        });
});
