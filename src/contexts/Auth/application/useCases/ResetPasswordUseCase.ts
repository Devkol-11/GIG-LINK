import { IAuthRepository } from "../../ports/AuthRepository.js";
import { IOtpRepository } from "../../ports/OtpRepository.js";
import { BusinessError } from "../../domain/errors/BusinessError.js";
import { AuthService } from "../../domain/services/AuthService.js";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService.js";
import { authRepository } from "../../infrastructure/AuthRepository.js";
import { otpRepository } from "../../infrastructure/OtpRepository.js";

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

    await Promise.allSettled([
      this.authRepository.updatePassword(tokenData.userId, passwordHash),
      this.otpRepository.deleteAllForUser(tokenData.userId),
    ]);

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
