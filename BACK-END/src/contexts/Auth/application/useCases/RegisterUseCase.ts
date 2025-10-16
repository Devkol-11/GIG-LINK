// import { User } from "../../domain/entities/User";
import { RegisterUserCommand, RegisterUserResult } from "../dtos/Register";
import { IAuthRepository } from "../../domain/interfaces/AuthRepository";
import { AuthService } from "../../domain/services/AuthService";
import { BusinessError } from "../../domain/errors/DomainErrors";
// import { IEventBus } from "../../domain/interfaces/EventbBus";
// import { UserRegisteredEvent } from "../../domain/events/UserRegisteredEvent";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService";
import { authRepository } from "../../infrastructure/AuthRepository";
// import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService";

export class RegisterUseCase {
  constructor(
    private authservice: AuthService,
    private authRepository: IAuthRepository // private eventBus: IEventBus
  ) {}

  async Execute(DTO: RegisterUserCommand): Promise<RegisterUserResult> {
    const { email, password, firstName, lastName, phoneNumber } = DTO;

    if (await this.authRepository.findByEmail(email)) {
      throw BusinessError.notFound(`User with email : ${email} already exists`);
    }

    const passwordHash = await this.authservice.hashPassword(password);

    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      phoneNumber,
      isEmailVerified: false,
      refreshToken: null,
    };

    const newUser = await this.authRepository.save(userData);

    const accessToken = this.authservice.generateAccessToken(
      newUser.id,
      newUser.email
    );

    const refreshToken = this.authservice.generateRefreshToken(
      newUser.id,
      newUser.email
    );

    const expiresAt = this.authservice.calculateTokenExpiryDate(7);

    await this.authRepository.saveRefreshToken(
      newUser.id,
      refreshToken,
      expiresAt
    );

    return {
      message: "Registration Successful , welcome !",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isEmailVerified: newUser.isEmailVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export const registerUseCase = new RegisterUseCase(
  authservice,
  authRepository
  // rabbitMQEventPublisher
);
