import { LoginUserCommand, LoginUserResult } from '../dtos/Login.js';
import { IAuthRepository } from '../../ports/IAuthRepository.js';
import { AuthService, authservice } from '../../domain/services/AuthService.js';
import { InvalidCredentials, UserNotFound } from '../../domain/errors/DomainErrors.js';
import { authRepository } from '../../adapters/AuthRepository.js';

export class LoginUseCase {
        constructor(
                private authService: AuthService,
                private authRepository: IAuthRepository
        ) {}

        async Execute(DTO: LoginUserCommand): Promise<LoginUserResult> {
                const { email, password } = DTO;

                const user = await this.authRepository.findByEmail(email);

                if (!user) throw new UserNotFound();

                if (user.passwordHash === null)
                        throw new InvalidCredentials('update your password');

                const passwordMatch = await this.authService.comparePassword(
                        password,
                        user.passwordHash
                );

                if (passwordMatch === false) throw new InvalidCredentials('wrong password');

                const accessToken = this.authService.generateAccessToken(
                        user.id,
                        user.email,
                        user.role
                );

                const refreshTokenPayload = this.authService.generateRefreshToken(user.id, 7);

                await this.authRepository.saveRefreshToken(
                        user.id,
                        refreshTokenPayload.refreshToken,
                        refreshTokenPayload.expiresAt
                );

                return {
                        message: 'Login successful , Welcome back !',
                        tokens: {
                                accessToken: accessToken,
                                refreshToken: refreshTokenPayload.refreshToken
                        }
                };
        }
}

export const loginUseCase = new LoginUseCase(authservice, authRepository);
