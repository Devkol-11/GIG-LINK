// import { User } from "../../domain/entities/User";
import { RegisterUserCommand, RegisterUserResult } from '../dtos/Register.js';
import { IAuthRepository } from '../../ports/AuthRepository.js';
import { AuthService, authservice } from '../../domain/services/AuthService.js';
import { authRepository } from '../../infrastructure/AuthRepository.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { IEventBus } from '../../ports/EventBus.js';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent.js';
import { ROLE } from '@prisma/client';
// import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService.js";

export class RegisterUseCase {
        constructor(
                private authService: AuthService,
                private authRepository: IAuthRepository
        ) {}

        async Execute(DTO: RegisterUserCommand): Promise<RegisterUserResult> {
                const { email, password, firstName, lastName, phoneNumber } =
                        DTO;

                const user = await this.authRepository.findByEmail(email);

                if (user === null)
                        throw BusinessError.notFound(
                                'user not found , please register'
                        );

                const passwordHash =
                        await this.authService.hashPassword(password);

                const userData = {
                        email,
                        passwordHash,
                        firstName,
                        lastName,
                        role: ROLE.FREELANCER,
                        phoneNumber,
                        isEmailVerified: false,
                        refreshToken: null
                };

                const newUser = await this.authRepository.save(userData);

                const accessToken = this.authService.generateAccessToken(
                        newUser.id,
                        newUser.email,
                        newUser.role
                );

                const { refreshToken, expiresAt } =
                        this.authService.generateRefreshToken(newUser.id, 7);

                await this.authRepository.saveRefreshToken(
                        newUser.id,
                        refreshToken,
                        expiresAt
                );

                const payload = new UserRegisteredEvent(
                        newUser.id,
                        newUser.email,
                        newUser.firstName,
                        newUser.role
                );

                // await this.eventBus.publish(payload.routing_key, payload);-- SET-UP A CONSUMER TO SEND WELCOME EMAIL USING THIS PAYLOAD

                return {
                        message: `Registration Successful , welcome ${newUser.firstName} !`,
                        user: {
                                id: newUser.id,
                                email: newUser.email,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                isEmailVerified: newUser.isEmailVerified
                        },
                        tokens: {
                                accessToken,
                                refreshToken
                        }
                };
        }
}

export const registerUseCase = new RegisterUseCase(
        authservice,
        authRepository

        // rabbitMQEventPublisher
);
