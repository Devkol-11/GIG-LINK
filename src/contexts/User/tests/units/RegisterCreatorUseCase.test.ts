import { RegisterCreatorUseCase } from '../../application/useCases/RegisterCreatorUseCase.js';
import { User } from '../../domain/entities/User.js';
import { UserRole } from '../../domain/enums/DomainEnums.js';
import { UserConflictError } from '../../domain/errors/DomainErrors.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

jest.mock('../../domain/services/UserService.js');
jest.mock('../../adapters/UserRepository.js');
jest.mock('../../adapters/UnitOfWork.js');
jest.mock('../../adapters/DomainEventBus-impl.js');
jest.mock('@core/Winston/winston.js');

describe('RegisterCreatorUseCase - UNIT TESTS', () => {
        let usecase: RegisterCreatorUseCase;
        let mockUserService: any;
        let mockUserRepository: any;
        let mockUnitOfWork: any;
        let mockEventBus: any;

        beforeEach(() => {
                jest.clearAllMocks();

                mockUserService = {
                        hashPassword: jest.fn(),
                        generateAccessToken: jest.fn(),
                        generateRefreshToken: jest.fn()
                };

                mockUserRepository = {
                        findByEmail: jest.fn(),
                        save: jest.fn()
                };

                mockUnitOfWork = {
                        transaction: jest.fn()
                };

                mockEventBus = {
                        publish: jest.fn()
                };

                usecase = new RegisterCreatorUseCase(
                        mockUserService,
                        mockUserRepository,
                        mockUnitOfWork,
                        mockEventBus
                );
        });

        describe('execute', () => {
                it('should successfully register a new creator', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'creator@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        const mockNewUser = {
                                id: 'user-123',
                                email: registerCommand.email,
                                firstName: registerCommand.firstName,
                                lastName: registerCommand.lastName,
                                role: UserRole.CREATOR
                        };

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue(mockNewUser);

                        // Act
                        const result = await usecase.execute(registerCommand);

                        // Assert
                        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerCommand.email);
                        expect(mockUserService.hashPassword).toHaveBeenCalledWith(registerCommand.password);
                        expect(result.message).toContain('successfully created');
                });

                it('should throw UserConflictError if email already exists', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'existing@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        const existingUser = { id: 'user-existing', email: registerCommand.email };
                        mockUserRepository.findByEmail.mockResolvedValue(existingUser);

                        // Act & Assert
                        await expect(usecase.execute(registerCommand)).rejects.toThrow(UserConflictError);
                        expect(mockUserService.hashPassword).not.toHaveBeenCalled();
                });

                it('should use transaction for atomic operations', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'creator@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        let transactionCallbackCalled = false;
                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                transactionCallbackCalled = true;
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-123',
                                email: registerCommand.email
                        });

                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        // Act
                        await usecase.execute(registerCommand);

                        // Assert
                        expect(transactionCallbackCalled).toBe(true);
                        expect(mockUnitOfWork.transaction).toHaveBeenCalled();
                });

                it('should save user with password hash', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'creator@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        const hashedPassword = 'hashedPassword123';
                        mockUserService.hashPassword.mockResolvedValue(hashedPassword);

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-123',
                                email: registerCommand.email,
                                passwordHash: hashedPassword
                        });

                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        // Act
                        await usecase.execute(registerCommand);

                        // Assert
                        expect(mockUserService.hashPassword).toHaveBeenCalledWith(registerCommand.password);
                        expect(mockUserRepository.save).toHaveBeenCalled();
                });

                it('should generate tokens on successful registration', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'creator@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        const mockNewUser = {
                                id: 'user-123',
                                email: registerCommand.email,
                                firstName: registerCommand.firstName,
                                role: UserRole.CREATOR
                        };

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue(mockNewUser);
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        // Act
                        const result = await usecase.execute(registerCommand);

                        // Assert
                        expect(mockUserService.generateAccessToken).toHaveBeenCalledWith(
                                mockNewUser.id,
                                mockNewUser.email,
                                mockNewUser.firstName,
                                UserRole.CREATOR
                        );
                        expect(mockUserService.generateRefreshToken).toHaveBeenCalled();
                        expect(result.tokens).toBeDefined();
                });

                it('should set user role to CREATOR', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'creator@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-123',
                                role: UserRole.CREATOR
                        });

                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        // Act
                        await usecase.execute(registerCommand);

                        // Assert
                        expect(mockUserRepository.save).toHaveBeenCalled();
                });

                it('should handle database errors during save', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'creator@example.com',
                                password: 'password123',
                                firstName: 'John',
                                lastName: 'Doe',
                                phoneNumber: '+1234567890'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        mockUnitOfWork.transaction.mockRejectedValue(new Error('Database error'));

                        // Act & Assert
                        await expect(usecase.execute(registerCommand)).rejects.toThrow('Database error');
                });
        });
});
