import { LogOutUseCase } from '../../application/useCases/LogOutUseCase.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../adapters/UserRepository.js');

describe('LogOutUseCase - UNIT TESTS', () => {
        let usecase: LogOutUseCase;
        let mockUserRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockUserRepository = {
                        findById: jest.fn(),
                        invalidateRefreshToken: jest.fn()
                };

                usecase = new LogOutUseCase(mockUserRepository);
        });

        describe('execute', () => {
                it('should successfully logout user', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const mockUser = { id: userId, email: 'user@example.com' };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.invalidateRefreshToken.mockResolvedValue(undefined);

                        // Act
                        const result = await usecase.execute(userId);

                        // Assert
                        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
                        expect(mockUserRepository.invalidateRefreshToken).toHaveBeenCalledWith(userId);
                        expect(result.message).toContain('successfully');
                });

                it('should throw UserNotFoundError when user does not exist', async () => {
                        // Arrange
                        const userId = 'non-existent-user';
                        mockUserRepository.findById.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(userId)).rejects.toThrow(UserNotFoundError);
                        expect(mockUserRepository.invalidateRefreshToken).not.toHaveBeenCalled();
                });

                it('should invalidate all refresh tokens for user', async () => {
                        // Arrange
                        const userId = 'user-123';
                        const mockUser = { id: userId };

                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserRepository.invalidateRefreshToken.mockResolvedValue(undefined);

                        // Act
                        await usecase.execute(userId);

                        // Assert
                        expect(mockUserRepository.invalidateRefreshToken).toHaveBeenCalledWith(userId);
                });

                it('should return success message on logout', async () => {
                        // Arrange
                        const userId = 'user-123';
                        mockUserRepository.findById.mockResolvedValue({ id: userId });
                        mockUserRepository.invalidateRefreshToken.mockResolvedValue(undefined);

                        // Act
                        const result = await usecase.execute(userId);

                        // Assert
                        expect(result.message).toBeDefined();
                        expect(result.message).toContain('successfully');
                });

                it('should handle database errors gracefully', async () => {
                        // Arrange
                        const userId = 'user-123';
                        mockUserRepository.findById.mockResolvedValue({ id: userId });
                        mockUserRepository.invalidateRefreshToken.mockRejectedValue(
                                new Error('Database error')
                        );

                        // Act & Assert
                        await expect(usecase.execute(userId)).rejects.toThrow('Database error');
                });
        });
});
