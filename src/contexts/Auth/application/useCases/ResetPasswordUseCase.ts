import { IAuthRepository } from '../../ports/AuthRepository.js';
import { IOtpRepository } from '../../ports/OtpRepository.js';
import { InvalidToken, TokenNotFound } from '../../domain/errors/DomainErrors.js';
import { AuthService } from '../../domain/services/AuthService.js';
import { authservice } from '../../domain/services/AuthService.js';
import { authRepository } from '../../adapters/AuthRepository.js';
import { otpRepository } from '../../adapters/OtpRepository.js';
import { UnitOfWork, unitOfWork } from '../../adapters/UnitOfWork.js';

export class ResetPasswordUseCase {
        constructor(
                private authRepository: IAuthRepository,
                private authService: AuthService,
                private otpRepository: IOtpRepository,
                private unitOfWork: UnitOfWork
        ) {}

        async Execute(otp: string, newPassword: string) {
                const tokenData = await this.otpRepository.findByToken(otp);

                if (tokenData === null) throw new TokenNotFound();

                if (tokenData.token !== otp) {
                        throw new InvalidToken();
                }

                const currentDate = new Date();

                if (currentDate > tokenData.expiresAt) throw new InvalidToken('OTP expired');

                const passwordHash = await this.authService.hashPassword(newPassword);

                await this.unitOfWork.transaction(async (trx) => {
                        await this.authRepository.updatePassword(
                                tokenData.userId,
                                passwordHash,
                                trx
                        );
                        await this.otpRepository.deleteAllForUser(tokenData.userId, trx);
                });

                return {
                        message: 'Password reset Successful'
                };
        }
}

export const resetPasswordUseCase = new ResetPasswordUseCase(
        authRepository,
        authservice,
        otpRepository,
        unitOfWork
);
