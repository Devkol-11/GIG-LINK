import { IAuthRepository } from '../../ports/AuthRepository.js';
import {
        BusinessError,
        InternalServerError
} from '../../domain/errors/DomainErrors.js';
import { ROLE } from '@prisma/client';
import { authRepository } from '../../infrastructure/AuthRepository.js';
import { getGoogleAuthPayload } from '../../infrastructure/GoogleAuthClient-impl.js';
import { authservice, AuthService } from '../../domain/services/AuthService.js';

export class GoogleSignInUseCase {
        constructor(private authService: AuthService) {}

        async Execute(token: string) {
                const payload = await getGoogleAuthPayload(token);

                if (payload === undefined)
                        throw new InternalServerError(
                                'unexpected error , please try again '
                        );

                // generate tokens for this user

                const accessToken = this.authService.generateAccessToken();
        }
}

// TO-DO : figure out a way to generate tokens for users through google sign-up
