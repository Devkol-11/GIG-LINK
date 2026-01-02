import { RegisterUserCommand, RegisterUserResult } from '../dtos/Register.js';
import { IUserRepository } from '../../ports/IUserRepository.js';
import { UserService, userService } from '../../domain/services/UserService.js';
import { userRepository } from '../../adapters/UserRepository.js';
import { UserConflictError } from '../../domain/errors/DomainErrors.js';
import { UnitOfWork, unitOfWork } from '../../adapters/UnitOfWork.js';
import { IEventBus } from '../../ports/IEventBus.js';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent.js';
import { User } from '../../domain/entities/User.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';
import { UserRole } from '../../domain/enums/DomainEnums.js';

export class RegisterFreeLancerUseCase {
        constructor(
                private userService: UserService,
                private userRepository: IUserRepository,
                private unitOfWork: UnitOfWork,
                private eventBus: IEventBus
        ) {}

        async execute(DTO: RegisterUserCommand): Promise<RegisterUserResult> {
                const { email, password, firstName, lastName, phoneNumber } = DTO;

                const user = await this.userRepository.findByEmail(email);

                if (user) throw new UserConflictError();

                const passwordHash = await this.userService.hashPassword(password);

                const userData = User.Create({
                        email,
                        firstName,
                        lastName,
                        phoneNumber,
                        passwordHash,
                        googleId: null,
                        role: UserRole.FREELANCER
                });

                const { newUser, accessToken, refreshToken } = await this.unitOfWork.transaction(
                        async (trx) => {
                                const newUser = await this.userRepository.save(userData, trx);

                                const accessToken = this.userService.generateAccessToken(
                                        newUser.id,
                                        newUser.email,
                                        newUser.firstName,
                                        newUser.role
                                );

                                const { refreshToken, refreshTokenHash } =
                                        await this.userService.generateRefreshToken();

                                const EXPIRES_AT = 7;

                                const refreshTokenExpiry = new Date(
                                        Date.now() + EXPIRES_AT * 24 * 60 * 60 * 1000
                                );

                                await this.userRepository.saveRefreshToken(
                                        newUser.id,
                                        refreshTokenHash,
                                        refreshTokenExpiry,
                                        trx
                                );

                                return {
                                        newUser,
                                        accessToken,
                                        refreshToken
                                };
                        }
                );

                const eventPayload = new UserRegisteredEvent(newUser.email, newUser.firstName, newUser.role);

                await this.eventBus.publish(eventPayload.eventName, eventPayload.getEventPayload());

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

export const registerFreeLancerUseCase = new RegisterFreeLancerUseCase(
        userService,
        userRepository,
        unitOfWork,
        domainEventBus
);
