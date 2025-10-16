import { IAuthRepository } from "../../domain/interfaces/AuthRepository";
import { IOtpRepository } from "../../domain/interfaces/OtpRepository";
import { BusinessError } from "../../domain/errors/DomainErrors";
import { AuthService } from "../../domain/services/AuthService";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService";
import { authRepository } from "../../infrastructure/AuthRepository";
import { otpRepository } from "../../infrastructure/OtpRepository";

export class ResetPasswordUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private authService: AuthService,
    private otpRepository: IOtpRepository
  ) {}

  async Execute(otp: string, newPassword: string) {
    const tokenData = await this.otpRepository.findByToken(otp);

    if (!tokenData) {
      throw BusinessError.notFound("Invalid token");
    }
    if (tokenData.token !== otp) {
      throw BusinessError.notFound("Invalid Otp");
    }

    const passwordHash = await this.authService.hashPassword(newPassword);

    await this.authRepository.updatePassword(tokenData.userId, passwordHash);
    await this.otpRepository.deleteAllForUser(tokenData.userId);

    return {
      message: "Password reset Successful",
    };
  }
}

export const resetPasswordUseCase = new ResetPasswordUseCase(
  authRepository,
  authservice,
  otpRepository
);
