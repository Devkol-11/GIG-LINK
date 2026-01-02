import { LoginUserCommand, LoginUserResult } from '../dtos/Login.js';
import { IUserRepository } from '../../ports/IUserRepository.js';
import { UserService, userService } from '../../domain/services/UserService.js';
import { InvalidCredentialsError, UserNotFoundError } from '../../domain/errors/DomainErrors.js';
import { userRepository } from '../../adapters/UserRepository.js';

export class LoginUseCase {
        constructor(
                private userService: UserService,
                private userRepository: IUserRepository
        ) {}

        async execute(DTO: LoginUserCommand): Promise<LoginUserResult> {
                const { email, password } = DTO;

                const user = await this.userRepository.findByEmail(email);

                if (!user) throw new UserNotFoundError();

                if (user.passwordHash === null) throw new InvalidCredentialsError('update your password');

                const passwordMatch = await this.userService.comparePassword(password, user.passwordHash);

                if (passwordMatch === false) throw new InvalidCredentialsError('wrong password');

                const accessToken = this.userService.generateAccessToken(
                        user.id,
                        user.email,
                        user.firstName,
                        user.role
                );

                const { refreshToken, refreshTokenHash } = await this.userService.generateRefreshToken();
                const EXPIRES_AT = 7;
                const refreshTokenExpiry = new Date(Date.now() + EXPIRES_AT * 24 * 60 * 60 * 1000);

                await this.userRepository.saveRefreshToken(user.id, refreshTokenHash, refreshTokenExpiry);

                return {
                        message: 'Login successful , Welcome back !',
                        tokens: {
                                accessToken: accessToken,
                                refreshToken: refreshToken
                        }
                };
        }
}

export const loginUseCase = new LoginUseCase(userService, userRepository);
