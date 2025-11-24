import { IAuthRepository } from '../../ports/AuthRepository.js';
import { IOtpRepository } from '../../ports/OtpRepository.js';
import { AuthService } from '../../domain/services/AuthService.js';
import { IEventBus } from '../../ports/EventBus.js';
import { UserNotFound } from '../../domain/errors/DomainErrors.js';
import { PasswordResetEvent } from '../../domain/events/PasswordResetEvent.js';
import { authRepository } from '../../infrastructure/AuthRepository.js';
import { otpRepository } from '../../infrastructure/OtpRepository.js';
import { authservice } from '../../domain/services/AuthService.js';
// import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService";

export class ForgotPasswordUseCase {
        constructor(
                private authRepository: IAuthRepository,
                private otpRepository: IOtpRepository,
                private authService: AuthService // private eventPublisher: IEventPublisher
        ) {}

        async Execute(email: string) {
                
                const userData = await this.authRepository.findByEmail(email);

                if (!userData) throw new UserNotFound();

                
                const { otp, expiresAt } = this.authService.generateOTP(10);

                
                await this.otpRepository.create(userData.id, otp, expiresAt);

                const passwordResetEvent = new PasswordResetEvent(
                        userData.firstName,
                        userData.email,
                        otp
                );

                //SET-UP AN EVENT BUS TO SEND EMAIL TO THE USER WITH THE PASSWORD-RESET PAYLOAD

                return {
                        message: 'OTP sent , please check your mail',
                        otp
                };
        }
}

export const forgotPasswordUseCase = new ForgotPasswordUseCase(
        authRepository,
        otpRepository,
        authservice
        // rabbitMQEventPublisher,
);
