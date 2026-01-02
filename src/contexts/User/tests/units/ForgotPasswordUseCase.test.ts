import { ForgotPasswordUseCase } from '../../application/useCases/ForgotPasswordUseCase.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../domain/services/UserService.js');
jest.mock('../../adapters/UserRepository.js');
jest.mock('../../adapters/OtpRepository.js');

describe('ForgotPasswordUseCase - UNIT TESTS', () => {
        let usecase: ForgotPasswordUseCase;
        let mockUserService: any;
        let mockUserRepository: any;
        let mockOtpRepository: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockUserService = {
                        generateOTP: jest.fn()
                };

                mockUserRepository = {
                        findByEmail: jest.fn()
                };

                mockOtpRepository = {
                        create: jest.fn()
                };

                usecase = new ForgotPasswordUseCase(mockUserService, mockUserRepository, mockOtpRepository);
        });

        describe('execute', () => {
                it('should generate OTP for valid user email', async () => {
                        // Arrange
                        const command = { email: 'user@example.com' };
                        const mockUser = { id: 'user-123', email: command.email };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.generateOTP.mockReturnValue('123456');
                        mockOtpRepository.create.mockResolvedValue({
                                userId: mockUser.id,
                                token: '123456'
                        });

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(command.email);
                        expect(mockUserService.generateOTP).toHaveBeenCalled();
                        expect(mockOtpRepository.create).toHaveBeenCalled();
                        expect(result.message).toContain('sent');
                });

                it('should throw UserNotFoundError when email does not exist', async () => {
                        // Arrange
                        const command = { email: 'nonexistent@example.com' };
                        mockUserRepository.findByEmail.mockResolvedValue(null);

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow(UserNotFoundError);
                        expect(mockUserService.generateOTP).not.toHaveBeenCalled();
                });

                it('should create OTP record with expiry', async () => {
                        // Arrange
                        const command = { email: 'user@example.com' };
                        const mockUser = { id: 'user-123' };

                        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                        mockUserService.generateOTP.mockReturnValue('123456');
                        mockOtpRepository.create.mockResolvedValue({
                                userId: mockUser.id,
                                token: '123456',
                                expiresAt: expect.any(Date)
                        });

                        // Act
                        await usecase.execute(command);

                        // Assert
                        expect(mockOtpRepository.create).toHaveBeenCalledWith(
                                mockUser.id,
                                '123456',
                                expect.any(Date)
                        );
                });

                it('should return success message with email confirmation', async () => {
                        // Arrange
                        const command = { email: 'user@example.com' };
                        mockUserRepository.findByEmail.mockResolvedValue({ id: 'user-123' });
                        mockUserService.generateOTP.mockReturnValue('123456');
                        mockOtpRepository.create.mockResolvedValue({});

                        // Act
                        const result = await usecase.execute(command);

                        // Assert
                        expect(result.message).toBeDefined();
                        expect(result.message).toContain('sent');
                });

                it('should handle OTP generation errors', async () => {
                        // Arrange
                        const command = { email: 'user@example.com' };
                        mockUserRepository.findByEmail.mockResolvedValue({ id: 'user-123' });
                        mockUserService.generateOTP.mockThrowError('OTP generation failed');

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow();
                });

                it('should handle database errors on OTP creation', async () => {
                        // Arrange
                        const command = { email: 'user@example.com' };
                        mockUserRepository.findByEmail.mockResolvedValue({ id: 'user-123' });
                        mockUserService.generateOTP.mockReturnValue('123456');
                        mockOtpRepository.create.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(usecase.execute(command)).rejects.toThrow('Database error');
                });
        });
});
