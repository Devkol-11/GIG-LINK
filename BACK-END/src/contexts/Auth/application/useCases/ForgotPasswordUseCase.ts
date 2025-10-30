import { IAuthRepository } from "../../domain/interfaces/AuthRepository.js";
import { IOtpRepository } from "../../domain/interfaces/OtpRepository.js";
import { AuthService } from "../../domain/services/AuthService.js";
import { IEventBus } from "../../domain/interfaces/EventbBus.js";
import { BusinessError } from "../../domain/errors/BusinessError.js";
import { PasswordResetEvent } from "../../domain/events/PasswordResetEvent.js";

//IMPORT IMPLEMENTATIONS
import { authRepository } from "../../infrastructure/AuthRepository.js";
import { otpRepository } from "../../infrastructure/OtpRepository.js";
import { authservice } from "../../domain/services/AuthService.js";
// import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService";

export class ForgotPasswordUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpRepository: IOtpRepository,
    private authService: AuthService // private eventPublisher: IEventPublisher
  ) {}

  async Execute(email: string) {
    const userData = await this.authRepository.findByEmail(email);
    if (!userData) {
      throw BusinessError.notFound(`User with email : ${email} was not found`);
    }

    const { otp, expiresAt } = this.authService.generateOTP(10);

    await this.otpRepository.create(userData.id, otp, expiresAt);

    return {
      message: "OTP sent , please check your mail",
      otp,
    };
  }
}

export const forgotPasswordUseCase = new ForgotPasswordUseCase(
  authRepository,
  otpRepository,
  authservice
  // rabbitMQEventPublisher,
);
