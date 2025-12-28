import { IUserRepository } from '../../ports/IUserRepository.js';
import { IOtpRepository } from '../../ports/IOtpRepository.js';
import { UserService } from '../../domain/services/UserService.js';
import { IEventBus } from '../../ports/IEventBus.js';
import { UserNotFoundError } from '../../domain/errors/DomainErrors.js';
import { PasswordResetEvent } from '../../domain/events/PasswordResetEvent.js';
import { userRepository } from '../../adapters/UserRepository.js';
import { otpRepository } from '../../adapters/OtpRepository.js';
import { userService } from '../../domain/services/UserService.js';
import { domainEventBus } from '../../adapters/DomainEventBus-impl.js';

export class ForgotPasswordUseCase {
        constructor(
                private readonly userRepository: IUserRepository,
                private readonly otpRepository: IOtpRepository,
                private readonly userService: UserService,
                private readonly eventBus: IEventBus
        ) {}

        async execute(email: string) {
                const userData = await this.userRepository.findByEmail(email);

                if (!userData) throw new UserNotFoundError();

                const { otp, expiresAt } = this.userService.generateOTP(10);

                await this.otpRepository.create(userData.id, otp, expiresAt);

                const passwordResetEvent = new PasswordResetEvent(userData.firstName, userData.email, otp);

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
        userRepository,
        otpRepository,
        userService,
        domainEventBus
);
