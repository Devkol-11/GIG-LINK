import { LoginUserCommand, LoginUserResult } from "../dtos/Login";
import { IAuthRepository } from "../../domain/interfaces/AuthRepository";
import { AuthService } from "../../domain/services/AuthService";
import { logger } from "@core/logging/winston";
import { DomainException } from "../../domain/exceptions/DomainException";
import { IEventPublisher } from "../../domain/interfaces/EventPublisher";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService";
import { prismaRepository } from "../../infrastructure/PrismaRepository";
import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService";

export class LoginUseCase {
  constructor(
    private authService: AuthService,
    private authRepository: IAuthRepository,
    private eventPublisher: IEventPublisher
  ) {}

  async Execute(DTO: LoginUserCommand): Promise<LoginUserResult> {
    const { email, password } = DTO;

    logger.info("[UseCase] RegisterExecute", { email });

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new DomainException(
        `could not find user with email : ${email}`,
        404
      );
    }

    const comparePassword = await this.authService.comparePassword(
      password,
      user.password
    );

    if (!comparePassword) {
      throw new DomainException("invalid Password", 404);
    }

    const accessToken = this.authService.generateAccessToken(
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
      token: {
        accessToken,
      },
    };
  }
}

export const loginUseCase = new LoginUseCase(
  authservice,
  prismaRepository,
  rabbitMQEventPublisher
);
