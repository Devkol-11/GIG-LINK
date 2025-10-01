import { LoginUserCommand, LoginUserResult } from "../dtos/Login";
import { AuthRepository } from "../../domain/interfaces/AuthRepository";
import { AuthService } from "../../domain/services/AuthService";
import { EventPublisher } from "../../infrastructure/events/EventPublisher";
import { DomainException } from "../../domain/exceptions/DomainException";

export class LoginUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private authService: AuthService,
    private eventPublisher: EventPublisher
  ) {}

  async Execute(DTO: LoginUserCommand): Promise<LoginUserResult> {
    const { email, password } = DTO;

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

    const accessToken = this.authService.generateAuthToken(user.id, user.email);

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
