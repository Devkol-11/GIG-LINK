import { IAuthRepository } from '../../ports/AuthRepository.js';
import {
        BusinessError,
        InternalServerError
} from '../../domain/errors/DomainErrors.js';
import { ROLE } from '@prisma/client';
import { authRepository } from '../../infrastructure/AuthRepository.js';
import { getGoogleAuthPayload } from '../../infrastructure/GoogleAuthClient-impl.js';
import { authservice, AuthService } from '../../domain/services/AuthService.js';

export class GoogleAuthUseCase {
        constructor(
                private authRepository: IAuthRepository,
                private authService: AuthService
        ) {}

        async Execute(token: string) {
                // verify token gotten and receive payload if successful
                const payload = await getGoogleAuthPayload(token);

                // verify if payload was received (network i/o)
                if (payload === undefined) throw new InternalServerError();

                //extract users Google Info from Payload
                const email = payload.email || '';
                const firstName = payload.given_name || '';
                const lastName = payload.family_name || '';

                // verify if the user already exist in the system
                const existingUser =
                        await this.authRepository.findByEmail(email);

                // create new user if user does not already exist
                if (existingUser === null) {
                        // create newUser snapshot  data
                        const userData = {
                                email,
                                passwordHash: null,
                                firstName,
                                lastName,
                                role: ROLE.FREELANCER,
                                phoneNumber: null,
                                isEmailVerified: true,
                                refreshToken: null
                        };

                        // persist data to the database
                        const newUser =
                                await this.authRepository.save(userData);

                        //generate Access and Refresh Tokens then save
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
                                expiresAt
                        );

                        // return new payload and tokens for this case
                        return {
                                message: 'Registration SuccessFul , welcome !',
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

                const accessToken = this.authService.generateAccessToken(
                        existingUser.id,
                        existingUser.email,
                        existingUser.role
                );

                const { refreshToken, expiresAt } =
                        this.authService.generateRefreshToken(
                                existingUser.id,
                                7
                        );

                await this.authRepository.saveRefreshToken(
                        existingUser.id,
                        refreshToken,
                        expiresAt
                );

                return {
                        message: `Welcome back ${existingUser.firstName} !`,
                        data: {
                                id: existingUser.id,
                                email: existingUser.email,
                                firstName: existingUser.firstName,
                                lastName: existingUser.lastName,
                                isEmailVerified: existingUser.isEmailVerified
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
        authservice
);
