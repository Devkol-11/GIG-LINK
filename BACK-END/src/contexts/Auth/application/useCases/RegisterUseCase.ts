import { User } from "../../domain/entities/User";
import { RegisterUserCommand, RegisterUserResult } from "../dtos/Register";
import { IAuthRepository } from "../../domain/interfaces/AuthRepository";
import { AuthService } from "../../domain/services/AuthService";
import { DomainException } from "../../domain/exceptions/DomainException";
import { IEventPublisher } from "../../domain/interfaces/EventPublisher";
import { UserRegisteredEvent } from "../../domain/events/UserRegisteredEvent";

//IMPORT IMPLEMENTATIONS
import { authservice } from "../../domain/services/AuthService";
import { prismaRepository } from "../../infrastructure/PrismaRepository";
import { rabbitMQEventPublisher } from "../../infrastructure/RabbitMQService";

export class RegisterUseCase {
  constructor(
    private authservice: AuthService,
    private authRepository: IAuthRepository,
    private eventPublisher: IEventPublisher
  ) {}

  async Execute(DTO: RegisterUserCommand): Promise<RegisterUserResult> {
    const { email, password, firstName, lastName, phoneNumber } = DTO;

    if (await this.authRepository.findByEmail(email)) {
      throw new DomainException(`User : ${email} Already Exists`, 404);
    }

    const hashedPassword = await this.authservice.hashPassword(password);

    const user = User.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });

    const newUser = await this.authRepository.create(user);

    const accessToken = this.authservice.generateAccessToken(
      newUser.id,
      newUser.id
    );

    const userRegisteredEvent = new UserRegisteredEvent(
      newUser.id,
      newUser.email,
      newUser.firstName,
      newUser.lastName
    );

    await this.eventPublisher.publish(
      userRegisteredEvent.routing_key,
      userRegisteredEvent
    );

    return {
      message: "Registration Successful , Welcome !",
      user: {
        id: newUser.id,
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

export const registerUseCase = new RegisterUseCase(
  authservice,
  prismaRepository,
  rabbitMQEventPublisher
);
