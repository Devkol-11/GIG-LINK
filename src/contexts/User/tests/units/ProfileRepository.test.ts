import { ProfileRepository } from '../../adapters/ProfileRepository.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

jest.mock('@core/Prisma/prisma.client.js');

describe('ProfileRepository - UNIT TESTS', () => {
        let repository: ProfileRepository;
        let mockPrismaProfile: jest.Mocked<typeof prismaDbClient.userProfile>;

        beforeEach(() => {
                jest.clearAllMocks();
                mockPrismaProfile = prismaDbClient.userProfile as jest.Mocked<
                        typeof prismaDbClient.userProfile
                >;
                repository = new ProfileRepository();
        });

        describe('findUserById', () => {
                it('should find profile by user id', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                userId: 'user-456',
                                bio: 'Professional developer',
                                skills: ['TypeScript', 'Node.js'],
                                experience: '5 years'
                        };

                        mockPrismaProfile.findUnique.mockResolvedValue(mockProfile as any);

                        // Act
                        const result = await repository.findUserById('user-456');

                        // Assert
                        expect(mockPrismaProfile.findUnique).toHaveBeenCalledWith({
                                where: { userId: 'user-456' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when profile not found', async () => {
                        // Arrange
                        mockPrismaProfile.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findUserById('non-existent');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('findById', () => {
                it('should find profile by profile id', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                userId: 'user-456',
                                bio: 'Professional developer'
                        };

                        mockPrismaProfile.findUnique.mockResolvedValue(mockProfile as any);

                        // Act
                        const result = await repository.findById('profile-123');

                        // Assert
                        expect(mockPrismaProfile.findUnique).toHaveBeenCalledWith({
                                where: { id: 'profile-123' }
                        });
                        expect(result).toBeDefined();
                });

                it('should return null when profile id not found', async () => {
                        // Arrange
                        mockPrismaProfile.findUnique.mockResolvedValue(null);

                        // Act
                        const result = await repository.findById('non-existent-profile');

                        // Assert
                        expect(result).toBeNull();
                });
        });

        describe('save', () => {
                it('should create new profile successfully', async () => {
                        // Arrange
                        const mockProfileData = {
                                id: 'profile-123',
                                userId: 'user-456',
                                bio: 'Professional developer',
                                skills: ['TypeScript'],
                                experience: '5 years',
                                portfolio: 'https://portfolio.com'
                        };

                        const mockProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue(mockProfileData)
                        };

                        mockPrismaProfile.upsert.mockResolvedValue(mockProfileData as any);

                        // Act
                        const result = await repository.save(mockProfile as any);

                        // Assert
                        expect(mockPrismaProfile.upsert).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should update existing profile', async () => {
                        // Arrange
                        const mockProfileData = {
                                userId: 'user-456',
                                bio: 'Senior developer',
                                skills: ['TypeScript', 'React'],
                                experience: '7 years'
                        };

                        const mockProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue(mockProfileData)
                        };

                        mockPrismaProfile.upsert.mockResolvedValue(mockProfileData as any);

                        // Act
                        const result = await repository.save(mockProfile as any);

                        // Assert
                        expect(mockPrismaProfile.upsert).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should return null on save failure', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-456'
                                })
                        };

                        mockPrismaProfile.upsert.mockResolvedValue(null);

                        // Act
                        const result = await repository.save(mockProfile as any);

                        // Assert
                        expect(result).toBeNull();
                });

                it('should handle database errors on save', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-456'
                                })
                        };

                        mockPrismaProfile.upsert.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(repository.save(mockProfile as any)).rejects.toThrow('Database error');
                });
        });

        describe('entity mapping', () => {
                it('should map profile data correctly', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                userId: 'user-456',
                                bio: 'Developer',
                                skills: ['TypeScript'],
                                experience: '5 years',
                                portfolio: 'https://portfolio.com',
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockPrismaProfile.findUnique.mockResolvedValue(mockProfile as any);

                        // Act
                        const result = await repository.findUserById('user-456');

                        // Assert
                        expect(result).toBeTruthy();
                });

                it('should handle null skills and experience', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                userId: 'user-456',
                                bio: 'Developer',
                                skills: null,
                                experience: null
                        };

                        mockPrismaProfile.findUnique.mockResolvedValue(mockProfile as any);

                        // Act
                        const result = await repository.findUserById('user-456');

                        // Assert
                        expect(result).toBeDefined();
                });
        });

        describe('error handling', () => {
                it('should handle database connection errors', async () => {
                        // Arrange
                        mockPrismaProfile.findUnique.mockRejectedValue(new Error('Connection error'));

                        // Act & Assert
                        await expect(repository.findUserById('user-456')).rejects.toThrow('Connection error');
                });

                it('should handle constraint violations on save', async () => {
                        // Arrange
                        const mockProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue({
                                        userId: 'user-456'
                                })
                        };

                        mockPrismaProfile.upsert.mockRejectedValue(new Error('Constraint violation'));

                        // Act & Assert
                        await expect(repository.save(mockProfile as any)).rejects.toThrow();
                });
        });
});
