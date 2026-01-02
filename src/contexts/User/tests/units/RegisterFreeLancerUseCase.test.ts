import { RegisterFreeLancerUseCase } from '../../application/useCases/RegisterFreeLancerUseCase.js';
import { UserRole } from '../../domain/enums/DomainEnums.js';
import { UserConflictError } from '../../domain/errors/DomainErrors.js';

jest.mock('../../domain/services/UserService.js');
jest.mock('../../adapters/UserRepository.js');
jest.mock('../../adapters/UnitOfWork.js');
jest.mock('../../adapters/DomainEventBus-impl.js');
jest.mock('@core/Winston/winston.js');

describe('RegisterFreeLancerUseCase - UNIT TESTS', () => {
        let usecase: RegisterFreeLancerUseCase;
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

                usecase = new RegisterFreeLancerUseCase(
                        mockUserService,
                        mockUserRepository,
                        mockUnitOfWork,
                        mockEventBus
                );
        });

        describe('execute', () => {
                it('should successfully register a new freelancer', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'freelancer@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');
                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-456',
                                email: registerCommand.email,
                                firstName: registerCommand.firstName,
                                role: UserRole.FREELANCER
                        });

                        // Act
                        const result = await usecase.execute(registerCommand);

                        // Assert
                        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerCommand.email);
                        expect(result.message).toContain('successfully created');
                });

                it('should throw UserConflictError if email already exists', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'existing@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue({
                                id: 'user-existing',
                                email: registerCommand.email
                        });

                        // Act & Assert
                        await expect(usecase.execute(registerCommand)).rejects.toThrow(UserConflictError);
                        expect(mockUserService.hashPassword).not.toHaveBeenCalled();
                });

                it('should hash password correctly', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'freelancer@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-456',
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
                        expect(mockUserService.hashPassword).toHaveBeenCalledWith(registerCommand.password);
                });

                it('should set user role to FREELANCER', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'freelancer@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-456',
                                role: UserRole.FREELANCER
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

                it('should use transaction for atomic operations', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'freelancer@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        let transactionCalled = false;
                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                transactionCalled = true;
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-456'
                        });

                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        // Act
                        await usecase.execute(registerCommand);

                        // Assert
                        expect(transactionCalled).toBe(true);
                });

                it('should generate access and refresh tokens', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'freelancer@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        const mockNewUser = {
                                id: 'user-456',
                                email: registerCommand.email,
                                firstName: registerCommand.firstName,
                                role: UserRole.FREELANCER
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
                        expect(mockUserService.generateAccessToken).toHaveBeenCalled();
                        expect(mockUserService.generateRefreshToken).toHaveBeenCalled();
                        expect(result.tokens).toBeDefined();
                        expect(result.tokens.accessToken).toBe('accessToken123');
                        expect(result.tokens.refreshToken).toBe('refreshToken123');
                });

                it('should return success message with user details', async () => {
                        // Arrange
                        const registerCommand = {
                                email: 'freelancer@example.com',
                                password: 'password123',
                                firstName: 'Jane',
                                lastName: 'Smith',
                                phoneNumber: '+1987654321'
                        };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserService.hashPassword.mockResolvedValue('hashedPassword123');

                        mockUnitOfWork.transaction.mockImplementation(async (callback) => {
                                return callback({});
                        });

                        mockUserRepository.save.mockResolvedValue({
                                id: 'user-456',
                                email: registerCommand.email
                        });

                        mockUserService.generateAccessToken.mockReturnValue('accessToken123');
                        mockUserService.generateRefreshToken.mockResolvedValue({
                                refreshToken: 'refreshToken123',
                                refreshTokenHash: 'refreshTokenHash123'
                        });

                        // Act
                        const result = await usecase.execute(registerCommand);

                        // Assert
                        expect(result.message).toBeDefined();
                        expect(result.message).toContain('successfully created');
                });
        });
});
