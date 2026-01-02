import { ResetPasswordUseCase } from '../../application/useCases/ResetPasswordUseCase.js';
import { InvalidCredentialsError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../domain/services/UserService.js');
jest.mock('../../adapters/UserRepository.js');
jest.mock('../../adapters/OtpRepository.js');

describe('ResetPasswordUseCase - UNIT TESTS', () => {
        let usecase: ResetPasswordUseCase;
        let mockUserService: any;
        let mockUserRepository: any;
        let mockOtpRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockUserService = {
                        hashPassword: jest.fn()
                };

                mockUserRepository = {
                        findById: jest.fn(),
                        save: jest.fn()
                };

                mockOtpRepository = {
                        findByToken: jest.fn(),
                        markAsUsed: jest.fn()
                };

                usecase = new ResetPasswordUseCase(mockUserService, mockUserRepository, mockOtpRepository);
        });

        describe('execute', () => {
                it('should reset password with valid OTP', async () => {
                        // Arrange
                        const command = { otpToken: '123456', newPassword: 'newPassword123' };
                        const otpRecord = {
                                userId: 'user-123',
                                token: command.otpToken,
                                used: false,
                                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                        };

                        const mockUser = {
                                id: otpRecord.userId,
                                email: 'user@example.com',
                                getState: jest.fn().mockReturnValue({
                                        id: otpRecord.userId,
                                        email: 'user@example.com',
                                        passwordHash: 'oldHash'
                                })
                        };

                        mockOtpRepository.findByToken.mockResolvedValue(otpRecord);
                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserService.hashPassword.mockResolvedValue('newHashedPassword');
                        mockUserRepository.save.mockResolvedValue(mockUser);
                        mockOtpRepository.markAsUsed.mockResolvedValue(undefined);

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(mockOtpRepository.findByToken).toHaveBeenCalledWith(command.otpToken);
                        expect(mockUserService.hashPassword).toHaveBeenCalledWith(command.newPassword);
                        expect(mockUserRepository.save).toHaveBeenCalled();
                        expect(result.message).toContain('reset');
                });

                it('should throw InvalidCredentialsError for invalid OTP token', async () => {
                        // Arrange
                        const command = { otpToken: 'invalid-token', newPassword: 'newPassword123' };
                        mockOtpRepository.findByToken.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(InvalidCredentialsError);
                        expect(mockUserService.hashPassword).not.toHaveBeenCalled();
                });

                it('should throw InvalidCredentialsError for already used OTP', async () => {
                        // Arrange
                        const command = { otpToken: '123456', newPassword: 'newPassword123' };
                        const otpRecord = {
                                userId: 'user-123',
                                token: command.otpToken,
                                used: true
                        };

                        mockOtpRepository.findByToken.mockResolvedValue(otpRecord);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(InvalidCredentialsError);
                });

                it('should throw InvalidCredentialsError for expired OTP', async () => {
                        // Arrange
                        const command = { otpToken: '123456', newPassword: 'newPassword123' };
                        const otpRecord = {
                                userId: 'user-123',
                                token: command.otpToken,
                                used: false,
                                expiresAt: new Date(Date.now() - 10 * 60 * 1000) // Expired 10 minutes ago
                        };

                        mockOtpRepository.findByToken.mockResolvedValue(otpRecord);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(InvalidCredentialsError);
                });

                it('should hash new password correctly', async () => {
                        // Arrange
                        const command = { otpToken: '123456', newPassword: 'newPassword123' };
                        const otpRecord = {
                                userId: 'user-123',
                                used: false,
                                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                        };

                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue({
                                        id: 'user-123',
                                        email: 'user@example.com'
                                })
                        };

                        mockOtpRepository.findByToken.mockResolvedValue(otpRecord);
                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserService.hashPassword.mockResolvedValue('newHashedPassword');
                        mockUserRepository.save.mockResolvedValue(mockUser);
                        mockOtpRepository.markAsUsed.mockResolvedValue(undefined);

                        // Act
                        await usecase.execute(command);

                        // Assert
                        expect(mockUserService.hashPassword).toHaveBeenCalledWith(command.newPassword);
                });

                it('should mark OTP as used after reset', async () => {
                        // Arrange
                        const command = { otpToken: '123456', newPassword: 'newPassword123' };
                        const otpRecord = {
                                userId: 'user-123',
                                token: command.otpToken,
                                used: false,
                                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                        };

                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue({
                                        id: 'user-123'
                                })
                        };

                        mockOtpRepository.findByToken.mockResolvedValue(otpRecord);
                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserService.hashPassword.mockResolvedValue('newHashedPassword');
                        mockUserRepository.save.mockResolvedValue(mockUser);
                        mockOtpRepository.markAsUsed.mockResolvedValue(undefined);

                        // Act
                        await usecase.execute(command);

                        // Assert
                        expect(mockOtpRepository.markAsUsed).toHaveBeenCalled();
                });

                it('should update user password hash', async () => {
                        // Arrange
                        const command = { otpToken: '123456', newPassword: 'newPassword123' };
                        const otpRecord = {
                                userId: 'user-123',
                                used: false,
                                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                        };

                        const mockUser = {
                                id: 'user-123',
                                getState: jest.fn().mockReturnValue({
                                        id: 'user-123',
                                        passwordHash: 'oldHash'
                                })
                        };

                        mockOtpRepository.findByToken.mockResolvedValue(otpRecord);
                        mockUserRepository.findById.mockResolvedValue(mockUser);
                        mockUserService.hashPassword.mockResolvedValue('newHashedPassword');
                        mockUserRepository.save.mockResolvedValue(mockUser);
                        mockOtpRepository.markAsUsed.mockResolvedValue(undefined);

                        // Act
                        await usecase.execute(command);

                        // Assert
                        expect(mockUserRepository.save).toHaveBeenCalled();
                });
        });
});
