import { IAuthRepository } from "../../domain/interfaces/AuthRepository";
import { IOtpRepository } from "../../domain/interfaces/OtpRepository";
import { AuthService } from "../../domain/services/AuthService";
import { IEventBus } from "../../domain/interfaces/EventbBus";
import { BusinessError } from "../../domain/errors/DomainErrors";
import { PasswordResetEvent } from "../../domain/events/PasswordResetEvent";

//IMPORT IMPLEMENTATIONS
import { authRepository } from "../../infrastructure/AuthRepository";
import { otpRepository } from "../../infrastructure/OtpRepository";
import { authservice } from "../../domain/services/AuthService";
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
