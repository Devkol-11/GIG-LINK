import { LoginUseCase } from '../../application/useCases/LoginUseCase.js';
import { InvalidCredentialsError, UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../domain/services/UserService.js');
jest.mock('../../adapters/UserRepository.js');

describe('LoginUseCase - UNIT TESTS', () => {
        let usecase: LoginUseCase;
        let mockUserService: any;
        let mockUserRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockUserService = {
                        comparePassword: jest.fn(),
                        generateAccessToken: jest.fn(),
                        generateRefreshToken: jest.fn()
                };

                mockUserRepository = {
                        findByEmail: jest.fn(),
                        saveRefreshToken: jest.fn()
                };

                usecase = new LoginUseCase(mockUserService, mockUserRepository);
        });

        describe('execute', () => {
                it('should successfully login user with valid credentials', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'user@example.com',
                                password: 'password123'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: loginCommand.email,
                                firstName: 'John',
                                role: 'CREATOR',
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.comparePassword.mockResolvedValue(true);
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        mockUserRepository.saveRefreshToken.mockResolvedValue({
                                token: 'refreshTokenHash123'
                        });

                        // Act
                        const result = await usecase.execute(loginCommand);

                        // Assert
                        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginCommand.email);
                        expect(mockUserService.comparePassword).toHaveBeenCalledWith(
                                loginCommand.password,
                                mockUser.passwordHash
                        );
                        expect(result.message).toContain('Login successful');
                        expect(result.tokens).toBeDefined();
                });

                it('should throw UserNotFoundError when user does not exist', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'nonexistent@example.com',
                                password: 'password123'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(loginCommand)).rejects.toThrow(UserNotFoundError);
                        expect(mockUserService.comparePassword).not.toHaveBeenCalled();
                });

                it('should throw InvalidCredentialsError when password hash is null', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'user@example.com',
                                password: 'password123'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: loginCommand.email,
                                passwordHash: null
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);

                        // Act & Assert
                        await expect(usecase.execute(loginCommand)).rejects.toThrow(InvalidCredentialsError);
                });

                it('should throw InvalidCredentialsError when password does not match', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'user@example.com',
                                password: 'wrongpassword'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: loginCommand.email,
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.comparePassword.mockResolvedValue(false);

                        // Act & Assert
                        await expect(usecase.execute(loginCommand)).rejects.toThrow(InvalidCredentialsError);
                });

                it('should save refresh token with expiry', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'user@example.com',
                                password: 'password123'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: loginCommand.email,
                                firstName: 'John',
                                role: 'CREATOR',
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.comparePassword.mockResolvedValue(true);
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        mockUserRepository.saveRefreshToken.mockResolvedValue({
                                token: 'refreshTokenHash123'
                        });

                        // Act
                        await usecase.execute(loginCommand);

                        // Assert
                        expect(mockUserRepository.saveRefreshToken).toHaveBeenCalledWith(
                                mockUser.id,
                                'refreshTokenHash123',
                                expect.any(Date)
                        );
                });

                it('should generate access token with user details', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'user@example.com',
                                password: 'password123'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: loginCommand.email,
                                firstName: 'John',
                                role: 'CREATOR',
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.comparePassword.mockResolvedValue(true);
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        mockUserRepository.saveRefreshToken.mockResolvedValue({
                                token: 'refreshTokenHash123'
                        });

                        // Act
                        await usecase.execute(loginCommand);

                        // Assert
                        expect(mockUserService.generateAccessToken).toHaveBeenCalledWith(
                                mockUser.id,
                                mockUser.email,
                                mockUser.firstName,
                                mockUser.role
                        );
                });

                it('should return tokens in response', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'user@example.com',
                                password: 'password123'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: loginCommand.email,
                                firstName: 'John',
                                role: 'CREATOR',
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.comparePassword.mockResolvedValue(true);
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        mockUserRepository.saveRefreshToken.mockResolvedValue({
                                token: 'refreshTokenHash123'
                        });

                        // Act
                        const result = await usecase.execute(loginCommand);

                        // Assert
                        expect(result.tokens).toBeDefined();
                        expect(result.tokens.accessToken).toBe('accessToken123');
                        expect(result.tokens.refreshToken).toBe('refreshToken123');
                });

                it('should handle case-insensitive email lookup', async () => {
                        // Arrange
                        const loginCommand = {
                                email: 'USER@EXAMPLE.COM',
                                password: 'password123'
                        };

                        const mockUser = {
                                id: 'user-123',
                                email: 'user@example.com',
                                firstName: 'John',
                                role: 'CREATOR',
                                passwordHash: '$2b$10$hashedpassword'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.comparePassword.mockResolvedValue(true);
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        mockUserRepository.saveRefreshToken.mockResolvedValue({
                                token: 'refreshTokenHash123'
                        });

                        // Act
                        const result = await usecase.execute(loginCommand);

                        // Assert
                        expect(result.message).toContain('Login successful');
                });
        });
});
