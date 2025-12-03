import { RegisterUserCommand, RegisterUserResult } from '../dtos/Register.js';
import { IAuthRepository } from '../../ports/AuthRepository.js';
import { AuthService, authservice } from '../../domain/services/AuthService.js';
import { authRepository } from '../../adapters/AuthRepository.js';
import { UserConflict } from '../../domain/errors/DomainErrors.js';
import { UnitOfWork, unitOfWork } from '../../adapters/UnitOfWork.js';
import { IEventBus } from '../../ports/EventBus.js';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent.js';
import { ROLE } from '../../../../../prisma/generated/prisma/enums.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';

export class RegisterCreatorUseCase {
        constructor(
                private authService: AuthService,
                private authRepository: IAuthRepository,
                private unitOfWork: UnitOfWork,
                private eventBus: IEventBus
        ) {}

        async Execute(DTO: RegisterUserCommand): Promise<RegisterUserResult> {
                const { email, password, firstName, lastName, phoneNumber } =
                        DTO;

                const user = await this.authRepository.findByEmail(email);

                if (user) throw new UserConflict();

                const passwordHash =
                        await this.authService.hashPassword(password);

                const userData = {
                        email,
                        passwordHash,
                        googleId: null,
                        firstName,
                        lastName,
                        role: ROLE.CREATOR,
                        phoneNumber,
                        isEmailVerified: false,
                        refreshToken: null
                };

                const { newUser, accessToken, refreshToken } =
                        await this.unitOfWork.transaction(async (trx) => {
                                const newUser = await this.authRepository.save(
                                        userData,
                                        trx
                                );

                                const accessToken =
                                        this.authService.generateAccessToken(
                                                newUser.id,
                                                newUser.email,
                                                newUser.role
                                        );

                                const { refreshToken, expiresAt } =
                                        this.authService.generateRefreshToken(
                                                newUser.id,
                                                7
                                        );

                                await this.authRepository.saveRefreshToken(
                                        newUser.id,
                                        refreshToken,
                                        expiresAt,
                                        trx
                                );

                                return {
                                        newUser,
                                        accessToken,
                                        refreshToken
                                };
                        });

                const payload = new UserRegisteredEvent(
                        newUser.id,
                        newUser.email,
                        newUser.firstName,
                        newUser.role
                );

                await this.eventBus.publish(
                        payload.eventName,
                        payload.getEventPayload()
                );

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

export const registerCreatorUseCase = new RegisterCreatorUseCase(
        authservice,
        authRepository,
        unitOfWork,
        domainEventBus
);
