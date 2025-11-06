import { IAuthRepository } from "../../ports/AuthRepository.js";
import { IOtpRepository } from "../../ports/OtpRepository.js";
import { AuthService } from "../../domain/services/AuthService.js";
import { IEventBus } from "../../ports/EventbBus.js";
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
    // confirm user exists
    const userData = await this.authRepository.findByEmail(email);
    if (!userData) {
      throw BusinessError.notFound(`User with email : ${email} was not found`);
    }

    // generate OTP with expiration date
    const { otp, expiresAt } = this.authService.generateOTP(10);

    // persist the otp to the database
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
