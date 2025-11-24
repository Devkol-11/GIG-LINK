import { LoginUserCommand, LoginUserResult } from '../dtos/Login.js';
import { IAuthRepository } from '../../ports/AuthRepository.js';
import { AuthService, authservice } from '../../domain/services/AuthService.js';
import { logger } from '@src/core/logging/winston.js';
import {
        UserConflict,
        InvalidCredentials
} from '../../domain/errors/DomainErrors.js';
// import { IEventBus } from "../../domain/interfaces/EventbBus";
import { authRepository } from '../../infrastructure/AuthRepository.js';
// import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService.js";

export class LoginUseCase {
        constructor(
                private authService: AuthService,
                private authRepository: IAuthRepository // private eventPublisher: IEventPublisher
        ) {}

        async Execute(DTO: LoginUserCommand): Promise<LoginUserResult> {
                const { email, password } = DTO;

                const user = await this.authRepository.findByEmail(email);

                if (user === null) throw new UserConflict();

                if (user.passwordHash === null)
                        throw new InvalidCredentials('update your password');

                const passwordMatch = await this.authService.comparePassword(
                        password,
                        user.passwordHash
                );

                if (passwordMatch === false)
                        throw new InvalidCredentials('wrong password');

                const accessToken = this.authService.generateAccessToken(
                        user.id,
                        user.email,
                        user.role
                );

                const refreshTokenPayload =
                        this.authService.generateRefreshToken(user.id, 7);

                await this.authRepository.saveRefreshToken(
                        user.id,
                        refreshTokenPayload.refreshToken,
                        refreshTokenPayload.expiresAt
                );

                return {
                        message: 'Login successful , Welcome back !',
                        user: {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                isEmailVerified: user.isEmailVerified
                        },
                        tokens: {
                                accessToken,
                                refreshToken: refreshTokenPayload.refreshToken
                        }
                };
        }
}

export const loginUseCase = new LoginUseCase(
        authservice,
        authRepository
        // rabbitMQEventPublisher
);
