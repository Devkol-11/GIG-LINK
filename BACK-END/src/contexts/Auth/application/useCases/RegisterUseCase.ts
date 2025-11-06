// import { User } from "../../domain/entities/User";
import { RegisterUserCommand, RegisterUserResult } from "../dtos/Register.js";
import { IAuthRepository } from "../../ports/AuthRepository.js";
import { AuthService } from "../../domain/services/AuthService.js";
import { BusinessError } from "../../domain/errors/BusinessError.js";
import { IEventBus } from "../../ports/EventbBus.js";
import { UserRegisteredEvent } from "../../domain/events/UserRegisteredEvent.js";
import { ROLE } from "@prisma/client";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService.js";
import { authRepository } from "../../infrastructure/AuthRepository.js";
import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService.js";

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
      role: ROLE.FREELANCER,
      phoneNumber,
      isEmailVerified: false,
      refreshToken: null,
    };

    const newUser = await this.authRepository.save(userData);

    const accessToken = this.authservice.generateAccessToken(
      newUser.id,
      newUser.email,
      newUser.role
    );

    const { refreshToken, expiresAt } = this.authservice.generateRefreshToken(
      newUser.id,
      7
    );

    await this.authRepository.saveRefreshToken(
      newUser.id,
      refreshToken,
      expiresAt
    );

    const payload = new UserRegisteredEvent(
      newUser.id,
      newUser.email,
      newUser.firstName
    );

    // await this.eventBus.publish(payload.routing_key, payload);

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
