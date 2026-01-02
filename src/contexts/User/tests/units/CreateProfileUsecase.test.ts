import { CreateProfileUsecase } from '../../application/useCases/createProfileUsecase.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../adapters/ProfileRepository.js');
jest.mock('../../adapters/UserRepository.js');

describe('CreateProfileUsecase - UNIT TESTS', () => {
        let usecase: CreateProfileUsecase;
        let mockProfileRepository: any;
        let mockUserRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockProfileRepository = {
                        save: jest.fn()
                };

                mockUserRepository = {
                        findById: jest.fn()
                };

                usecase = new CreateProfileUsecase(mockProfileRepository, mockUserRepository);
        });

        describe('execute', () => {
                it('should create profile for existing user', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Professional developer',
                                skills: ['TypeScript', 'Node.js'],
                                experience: '5 years'
                        };

                        const mockUser = { id: command.userId, email: 'user@example.com' };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockProfileRepository.save.mockResolvedValue({
                                id: 'profile-123',
                                userId: command.userId,
                                bio: command.bio
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(mockUserRepository.findById).toHaveBeenCalledWith(command.userId);
                        expect(mockProfileRepository.save).toHaveBeenCalled();
                        expect(result).toBeDefined();
                });

                it('should throw UserNotFoundError if user does not exist', async () => {
                        // Arrange
                        const command = {
                                userId: 'non-existent',
                                bio: 'Professional developer'
                        };

                        mockUserRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(UserNotFoundError);
                        expect(mockProfileRepository.save).not.toHaveBeenCalled();
                });

                it('should save profile with all provided data', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Professional developer',
                                skills: ['TypeScript', 'Node.js'],
                                experience: '5 years',
                                portfolio: 'https://portfolio.com'
                        };

                        mockUserRepository.findById.mockResolvedValue({ id: command.userId });
                        mockProfileRepository.save.mockResolvedValue({
                                id: 'profile-123',
                                ...command
                        });

                        // Act
                        await usecase.execute(command);

                        // Assert
                        expect(mockProfileRepository.save).toHaveBeenCalled();
                });

                it('should return created profile with all details', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Professional developer'
                        };

                        mockUserRepository.findById.mockResolvedValue({ id: command.userId });
                        mockProfileRepository.save.mockResolvedValue({
                                id: 'profile-123',
                                userId: command.userId,
                                bio: command.bio
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result).toBeDefined();
                        expect(result.userId).toBe(command.userId);
                });

                it('should handle database errors during profile save', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                bio: 'Professional developer'
                        };

                        mockUserRepository.findById.mockResolvedValue({ id: command.userId });
                        mockProfileRepository.save.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow('Database error');
                });
        });
});
