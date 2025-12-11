import { IAuthRepository } from '../../ports/IAuthRepository.js';
import { IOtpRepository } from '../../ports/IOtpRepository.js';
import { AuthService } from '../../domain/services/AuthService.js';
import { IEventBus } from '../../ports/IEventBus.js';
import { UserNotFound } from '../../domain/errors/DomainErrors.js';
import { PasswordResetEvent } from '../../domain/events/PasswordResetEvent.js';
import { authRepository } from '../../adapters/AuthRepository.js';
import { otpRepository } from '../../adapters/OtpRepository.js';
import { authservice } from '../../domain/services/AuthService.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';
import { logger } from '@core/logging/winston.js';

export class ForgotPasswordUseCase {
        constructor(
                private readonly authRepository: IAuthRepository,
                private readonly otpRepository: IOtpRepository,
                private readonly authService: AuthService,
                private readonly eventBus: IEventBus
        ) {}

        async Execute(email: string) {
                const userData = await this.authRepository.findByEmail(email);

                if (!userData) throw new UserNotFound();

                logger.info(userData);

                const { otp, expiresAt } = this.authService.generateOTP(10);

                const newOtp = await this.otpRepository.create(userData.id, otp, expiresAt);

                logger.info(`${newOtp}`);

                const passwordResetEvent = new PasswordResetEvent(
                        userData.firstName,
                        userData.email,
                        otp
                );

                await this.eventBus.publish(
                        passwordResetEvent.eventName,
                        passwordResetEvent.getEventPayload()
                );

                return {
                        message: 'OTP sent , please check your mail'
                };
        }
}

export const forgotPasswordUseCase = new ForgotPasswordUseCase(
        authRepository,
        otpRepository,
        authservice,
        domainEventBus
);
