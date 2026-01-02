import { UpdateProfileUsecase } from '../../application/useCases/UpdateProfileUsecase.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../adapters/ProfileRepository.js');
jest.mock('../../adapters/UserRepository.js');

describe('UpdateProfileUsecase - UNIT TESTS', () => {
        let usecase: UpdateProfileUsecase;
        let mockProfileRepository: any;
        let mockUserRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockProfileRepository = {
                        findUserById: jest.fn(),
                        save: jest.fn()
                };

                mockUserRepository = {
                        findById: jest.fn()
                };

                usecase = new UpdateProfileUsecase(mockProfileRepository, mockUserRepository);
        });

        describe('execute', () => {
                it('should update profile for existing user', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Updated bio',
                                skills: ['TypeScript', 'React'],
                                experience: '6 years'
                        };

                        const mockUser = { id: command.userId };
                        const existingProfile = {
                                id: 'profile-123',
                                userId: command.userId,
                                bio: 'Old bio',
                                getState: jest.fn().mockReturnValue({
                                        id: 'profile-123',
                                        userId: command.userId
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockProfileRepository.findUserById.mockResolvedValue(existingProfile);
                        mockProfileRepository.save.mockResolvedValue({
                                id: 'profile-123',
                                userId: command.userId,
                                bio: command.bio,
                                skills: command.skills
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(mockUserRepository.findById).toHaveBeenCalledWith(command.userId);
                        expect(mockProfileRepository.save).toHaveBeenCalled();
                        expect(result.bio).toBe(command.bio);
                });

                it('should throw UserNotFoundError if user does not exist', async () => {
                        // Arrange
                        const command = {
                                userId: 'non-existent',
                                bio: 'Updated bio'
                        };

                        mockUserRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(UserNotFoundError);
                        expect(mockProfileRepository.save).not.toHaveBeenCalled();
                });

                it('should preserve existing profile fields not in update', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Updated bio'
                        };

                        const mockUser = { id: command.userId };
                        const existingProfile = {
                                id: 'profile-123',
                                userId: command.userId,
                                bio: 'Old bio',
                                skills: ['TypeScript'],
                                experience: '5 years',
                                getState: jest.fn().mockReturnValue({
                                        id: 'profile-123',
                                        userId: command.userId,
                                        skills: ['TypeScript'],
                                        experience: '5 years'
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockProfileRepository.findUserById.mockResolvedValue(existingProfile);
                        mockProfileRepository.save.mockResolvedValue({
                                id: 'profile-123',
                                bio: command.bio,
                                skills: ['TypeScript'],
                                experience: '5 years'
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result.skills).toEqual(['TypeScript']);
                        expect(result.experience).toBe('5 years');
                });

                it('should update multiple profile fields', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Updated bio',
                                skills: ['TypeScript', 'React', 'Node.js'],
                                experience: '6 years',
                                portfolio: 'https://new-portfolio.com'
                        };

                        const mockUser = { id: command.userId };
                        const existingProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue({
                                        id: 'profile-123'
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockProfileRepository.findUserById.mockResolvedValue(existingProfile);
                        mockProfileRepository.save.mockResolvedValue({
                                id: 'profile-123',
                                ...command
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result.bio).toBe(command.bio);
                        expect(result.skills).toEqual(command.skills);
                        expect(result.experience).toBe(command.experience);
                });

                it('should handle database errors during update', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Updated bio'
                        };

                        const mockUser = { id: command.userId };
                        const existingProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue({})
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockProfileRepository.findUserById.mockResolvedValue(existingProfile);
                        mockProfileRepository.save.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow('Database error');
                });

                it('should return updated profile with all fields', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Updated bio',
                                skills: ['TypeScript']
                        };

                        const mockUser = { id: command.userId };
                        const existingProfile = {
                                id: 'profile-123',
                                getState: jest.fn().mockReturnValue({})
                        };

                        const updatedProfile = {
                                id: 'profile-123',
                                userId: command.userId,
                                bio: command.bio,
                                skills: command.skills,
                                createdAt: new Date(),
                                updatedAt: new Date()
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockProfileRepository.findUserById.mockResolvedValue(existingProfile);
                        mockProfileRepository.save.mockResolvedValue(updatedProfile);

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result).toEqual(updatedProfile);
                });
        });
});
