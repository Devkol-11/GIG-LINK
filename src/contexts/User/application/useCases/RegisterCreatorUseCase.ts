import { RegisterUserCommand, RegisterUserResult } from '../dtos/Register.js';
import { IUserRepository } from '../../ports/IUserRepository.js';
import { UserService, userService } from '../../domain/services/UserService.js';
import { userRepository } from '../../adapters/UserRepository.js';
import { UserConflictError } from '../../domain/errors/DomainErrors.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IEventBus } from '../../ports/IEventBus.js';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent.js';
import { UserRole } from '../../domain/enums/DomainEnums.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';
import { User } from '../../domain/entities/User.js';
import { logger } from '@core/Winston/winston.js';
export class RegisterCreatorUseCase {
        constructor(
                private userService: UserService,
                private userRepository: IUserRepository,
                private unitOfWork: IUnitOfWork,
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
                        role: UserRole.CREATOR,
                        googleId: null
                });

                const { newUser, accessToken, refreshToken } = await this.unitOfWork.transaction(
                        async (trx) => {
                                const newUser = await this.userRepository.save(userData, trx);

                                logger.info('user saved successfully in database');

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

                logger.info(`New creator registered: ${newUser.email}`);

                const payload = new UserRegisteredEvent(newUser.email, newUser.firstName, newUser.role);

                logger.info(`Event payload: ${JSON.stringify(payload)}`);

                logger.info('publishing UserRegisteredEvent to event bus');

                await this.eventBus.publish(payload.eventName, payload.getEventPayload());

                logger.info('UserRegisteredEvent published successfully');

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
        userService,
        userRepository,
        unitOfWork,
        domainEventBus
);
