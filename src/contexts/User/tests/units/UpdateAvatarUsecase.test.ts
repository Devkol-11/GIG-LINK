import { UpdateAvatarUsecase } from '../../application/useCases/updateAvatarUsecase.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../adapters/UserRepository.js');
jest.mock('../../adapters/avatarGenerator.js');

describe('UpdateAvatarUsecase - UNIT TESTS', () => {
        let usecase: UpdateAvatarUsecase;
        let mockUserRepository: any;
        let mockAvatarGenerator: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockUserRepository = {
                        findById: jest.fn(),
                        save: jest.fn()
                };

                mockAvatarGenerator = {
                        generateAvatar: jest.fn()
                };

                usecase = new UpdateAvatarUsecase(mockUserRepository, mockAvatarGenerator);
        });

        describe('execute', () => {
                it('should update user avatar successfully', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                avatarUrl: 'https://example.com/avatar.jpg'
                        };

                        const mockUser = {
                                id: command.userId,
                                email: 'user@example.com',
                                avatar: null,
                                getState: jest.fn().mockReturnValue({
                                        id: command.userId,
                                        avatar: null
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.save.mockResolvedValue({
                                id: command.userId,
                                avatar: command.avatarUrl
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(mockUserRepository.findById).toHaveBeenCalledWith(command.userId);
                        expect(mockUserRepository.save).toHaveBeenCalled();
                        expect(result.avatar).toBe(command.avatarUrl);
                });

                it('should throw UserNotFoundError if user does not exist', async () => {
                        // Arrange
                        const command = {
                                userId: 'non-existent',
                                avatarUrl: 'https://example.com/avatar.jpg'
                        };

                        mockUserRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(UserNotFoundError);
                        expect(mockUserRepository.save).not.toHaveBeenCalled();
                });

                it('should update existing avatar', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                avatarUrl: 'https://example.com/new-avatar.jpg'
                        };

                        const mockUser = {
                                id: command.userId,
                                avatar: 'https://example.com/old-avatar.jpg',
                                getState: jest.fn().mockReturnValue({
                                        id: command.userId,
                                        avatar: 'https://example.com/old-avatar.jpg'
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.save.mockResolvedValue({
                                id: command.userId,
                                avatar: command.avatarUrl
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result.avatar).toBe(command.avatarUrl);
                });

                it('should generate avatar if no URL provided', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123'
                        };

                        const mockUser = {
                                id: command.userId,
                                firstName: 'John',
                                lastName: 'Doe',
                                getState: jest.fn().mockReturnValue({
                                        id: command.userId
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockAvatarGenerator.generateAvatar.mockResolvedValue(
                                'https://api.example.com/avatar/john-doe'
                        );
                        mockUserRepository.save.mockResolvedValue({
                                id: command.userId,
                                avatar: 'https://api.example.com/avatar/john-doe'
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(mockAvatarGenerator.generateAvatar).toHaveBeenCalled();
                        expect(result.avatar).toBeDefined();
                });

                it('should save user with updated avatar', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                avatarUrl: 'https://example.com/avatar.jpg'
                        };

                        const mockUser = {
                                id: command.userId,
                                getState: jest.fn().mockReturnValue({
                                        id: command.userId
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.save.mockResolvedValue({
                                id: command.userId,
                                avatar: command.avatarUrl
                        });

                        // Act
                        await usecase.execute(command);

                        // Assert
                        expect(mockUserRepository.save).toHaveBeenCalled();
                });

                it('should handle database errors during save', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                avatarUrl: 'https://example.com/avatar.jpg'
                        };

                        const mockUser = {
                                id: command.userId,
                                getState: jest.fn().mockReturnValue({
                                        id: command.userId
                                })
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.save.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow('Database error');
                });

                it('should return user with updated avatar', async () => {
                        // Arrange
                        const command = {
                                userId: 'user-123',
                                avatarUrl: 'https://example.com/avatar.jpg'
                        };

                        const mockUser = {
                                id: command.userId,
                                email: 'user@example.com',
                                firstName: 'John',
                                lastName: 'Doe',
                                getState: jest.fn().mockReturnValue({
                                        id: command.userId,
                                        email: 'user@example.com'
                                })
                        };

                        const updatedUser = {
                                id: command.userId,
                                email: 'user@example.com',
                                firstName: 'John',
                                lastName: 'Doe',
                                avatar: command.avatarUrl
                        };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.save.mockResolvedValue(updatedUser);

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result.avatar).toBe(command.avatarUrl);
                        expect(result.email).toBe(mockUser.email);
                });
        });
});
