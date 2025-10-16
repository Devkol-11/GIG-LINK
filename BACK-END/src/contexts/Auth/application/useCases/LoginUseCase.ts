import { LoginUserCommand, LoginUserResult } from "../dtos/Login";
import { IAuthRepository } from "../../domain/interfaces/AuthRepository";
import { AuthService } from "../../domain/services/AuthService";
import { logger } from "@core/logging/winston";
import { BusinessError } from "../../domain/errors/DomainErrors";
// import { IEventBus } from "../../domain/interfaces/EventbBus";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService";
import { authRepository } from "../../infrastructure/AuthRepository";
import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService";

export class LoginUseCase {
  constructor(
    private authService: AuthService,
    private authRepository: IAuthRepository // private eventPublisher: IEventPublisher
  ) {}

  async Execute(DTO: LoginUserCommand): Promise<LoginUserResult> {
    const { email, password } = DTO;

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw BusinessError.notFound(
        `user with email : ${email} was not found , please register `
      );
    }

    const comparePassword = await this.authService.comparePassword(
      password,
      user.passwordHash
    );

    if (!comparePassword) {
      throw BusinessError.badRequest("Invalid Password");
    }

    const accessToken = this.authService.generateAccessToken(
      user.id,
      user.email
    );

    const refreshToken = this.authService.generateRefreshToken(
      user.id,
      user.email
    );

    return {
      message: "Login successful , Welcome back !",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export const loginUseCase = new LoginUseCase(
  authservice,
  authRepository
  // rabbitMQEventPublisher
);
