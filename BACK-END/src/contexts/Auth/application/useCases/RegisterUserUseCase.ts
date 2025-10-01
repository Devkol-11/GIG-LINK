import { User } from "../../domain/entities/User";
import { RegisterUserCommand, RegisterUserResult } from "../dtos/Register";
import { AuthRepository } from "../../domain/interfaces/AuthRepository";
import { AuthService } from "../../domain/services/AuthService";
import { EventPublisher } from "../../infrastructure/events/EventPublisher";
import { DomainException } from "../../domain/exceptions/DomainException";

export class RegisterUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private authservice: AuthService,
    private eventPublisher: EventPublisher
  ) {}

  async Execute(DTO: RegisterUserCommand): Promise<RegisterUserResult> {
    const { email, password, firstName, lastName, phoneNumber } = DTO;

    if (await this.authRepository.existsByEmail(email)) {
      throw new DomainException("User Already Exists", 404);
    }

    const hashedPassword = await this.authservice.hashPassword(password);

    const user = User.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });

    await this.authRepository.save(user);

    const accessToken = this.authservice.generateAuthToken(user.id, user.email);

    const payload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      timestamp: new Date(),
    };

    await this.eventPublisher.publish("User Registered", payload);

    return {
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
