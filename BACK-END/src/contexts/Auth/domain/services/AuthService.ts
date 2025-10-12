import { IpasswordHasher } from "../interfaces/PasswordHasher.ts";
import { ITokenGenerator } from "../interfaces/TokenGenerator";
//IMPORT IMPLEMANTATIONS
import { jwtLibary } from "../../infrastructure/JwtService";
import { bcryptLibary } from "../../infrastructure/BcryptService";

export class AuthService {
  constructor(
    private tokenGenerator: ITokenGenerator,
    private passwordHasher: IpasswordHasher
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

  generateAccessToken(email: string, userId?: string): string {
    return this.tokenGenerator.generateAccessToken({ userId, email });
  }
  generateRefreshToken(userId: string, email: string): string {
    return this.tokenGenerator.generateRefreshToken({ userId, email });
  }

  verifyAccessToken(token: string): any {
    return this.tokenGenerator.verifyAccessToken(token);
  }

  verifyRefreshToken(token: string): any {
    return this.tokenGenerator.verifyRefreshToken(token);
  }
}

export const authservice = new AuthService(jwtLibary, bcryptLibary);
