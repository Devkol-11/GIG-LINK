import { IAuthRepository } from '../../ports/IAuthRepository.js';
import { InternalServerError } from '../../domain/errors/DomainErrors.js';
import { ROLE } from '../../../../../prisma/generated/prisma/enums.js';
import { User } from 'prisma/generated/prisma/client.js';
import { authRepository } from '../../adapters/AuthRepository.js';
import { getGoogleAuthPayload } from '../../adapters/GoogleAuthClient-impl.js';
import { authservice, AuthService } from '../../domain/services/AuthService.js';
import { UnitOfWork, unitOfWork } from '../../adapters/UnitOfWork.js';
import { IEventBus } from '../../ports/IEventBus.js';
import { UserRegisteredEvent } from '../../domain/events/UserRegisteredEvent.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';

export class GoogleAuthUseCase {
        constructor(
                private authRepository: IAuthRepository,
                private authService: AuthService,
                private unitOfWork: UnitOfWork,
                private eventBus: IEventBus
        ) {}

        async Execute(token: string) {
                // Verify token and get Google user info
                const payload = await getGoogleAuthPayload(token);

                if (payload === undefined)
                        throw new InternalServerError('Failed to verify Google token');

                // Extract user information from Google payload
                const googleId = payload.sub; // Google's unique ID for the user
                const email = payload.email || '';
                const firstName = payload.given_name || '';
                const lastName = payload.family_name || '';

                // Check if user exists by Google ID first
                let user = await this.authRepository.findByGoogleId(googleId);

                if (user) {
                        // Existing Google user - authenticate and return tokens
                        return this.authenticateExistingUser(user);
                }

                // Check if user exists by email
                user = await this.authRepository.findByEmail(email);

                if (user) {
                        // User exists with email/password - need to link accounts
                        if (user.googleId) {
                                // This shouldn't happen if we checked by googleId first, but just in case
                                throw new InternalServerError(
                                        'User exists with email but not googleId'
                                );
                        }

                        // Link Google account to existing user
                        return this.linkGoogleAccount(user, googleId);
                }

                // New user - register with Google
                return this.registerNewGoogleUser(googleId, email, firstName, lastName);
        }

        private async authenticateExistingUser(user: User) {
                const { accessToken, refreshToken } = await this.unitOfWork.transaction(
                        async (trx) => {
                                const accessToken = this.authService.generateAccessToken(
                                        user.id,
                                        user.email,
                                        user.role
                                );

                                const { refreshToken, expiresAt } =
                                        this.authService.generateRefreshToken(user.id, 7);

                                await this.authRepository.saveRefreshToken(
                                        user.id,
                                        refreshToken,
                                        expiresAt,
                                        trx
                                );

                                return { accessToken, refreshToken };
                        }
                );

                return {
                        message: `Welcome back ${user.firstName}!`,
                        user: {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                isEmailVerified: user.isEmailVerified
                        },
                        tokens: {
                                accessToken,
                                refreshToken
                        }
                };
        }

        private async linkGoogleAccount(user: User, googleId: string) {
                const { accessToken, refreshToken } = await this.unitOfWork.transaction(
                        async (trx) => {
                                // Update user with Google ID
                                const updatedUser = await this.authRepository.updateGoogleId(
                                        user.id,
                                        googleId,
                                        trx
                                );

                                const accessToken = this.authService.generateAccessToken(
                                        updatedUser.id,
                                        updatedUser.email,
                                        updatedUser.role
                                );

                                const { refreshToken, expiresAt } =
                                        this.authService.generateRefreshToken(updatedUser.id, 7);

                                await this.authRepository.saveRefreshToken(
                                        updatedUser.id,
                                        refreshToken,
                                        expiresAt,
                                        trx
                                );

                                return {
                                        accessToken,
                                        refreshToken,
                                        updatedUser
                                };
                        }
                );

                return {
                        message: `Google account linked successfully! Welcome back ${user.firstName}!`,
                        user: {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                isEmailVerified: user.isEmailVerified
                        },
                        tokens: {
                                accessToken,
                                refreshToken
                        }
                };
        }

        private async registerNewGoogleUser(
                googleId: string,
                email: string,
                firstName: string,
                lastName: string
        ) {
                const { newUser, accessToken, refreshToken } = await this.unitOfWork.transaction(
                        async (trx) => {
                                // Create new user with Google data
                                const userData = {
                                        email,
                                        passwordHash: null,
                                        googleId,
                                        firstName,
                                        lastName,
                                        role: ROLE.FREELANCER,
                                        phoneNumber: null,
                                        isEmailVerified: true, // Google verifies the email
                                        refreshToken: null
                                };

                                const newUser = await this.authRepository.save(userData, trx);

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
                                        expiresAt,
                                        trx
                                );

                                return { newUser, accessToken, refreshToken };
                        }
                );

                // Publish user registration event
                const eventPayload = new UserRegisteredEvent(
                        newUser.id,
                        newUser.email,
                        newUser.firstName,
                        newUser.role
                );

                await this.eventBus.publish(eventPayload.eventName, eventPayload.getEventPayload());

                return {
                        message: `Registration successful, welcome ${newUser.firstName}!`,
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

export const googleAuthUseCase = new GoogleAuthUseCase(
        authRepository,
        authservice,
        unitOfWork,
        domainEventBus
);
