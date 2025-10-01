export class AuthService {
  constructor(
    private passwordHasher: passwordHasher,
    private tokenGenerator: TokenGenerator
  ) {}

  async hashPassword(password: string): Promise<string> {
    return this.passwordHasher.hash(password);
  }

  async comparePassword(
    plainPassoword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return this.passwordHasher.compare(plainPassoword, hashedPassword);
  }

  generateAuthToken(userId: string, email: string): string {
    return this.tokenGenerator.generateToken({ userId, email });
  }

  verifyAuthToken(token: string): any {
    return this.tokenGenerator.verifyToken(token);
  }
}

export interface passwordHasher {
  hash(plainPassoword: string): Promise<string>;
  compare(plainPassoword: string, hashedPassword: string): Promise<boolean>;
}

export interface TokenGenerator {
  generateToken(payload: object): string;
  verifyToken(token: string): any;
}
