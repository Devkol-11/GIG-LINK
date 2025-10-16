import { IpasswordHasher } from "../interfaces/PasswordHasher.ts";
import { ITokenGenerator } from "../interfaces/TokenGenerator";
import { randomBytes } from "crypto";
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

  calculateTokenExpiryDate(days: number) {
    const refreshTokenExpiryDays = days;
    const expiresAt = new Date(
      Date.now() + refreshTokenExpiryDays * 24 * 60 * 60 * 1000
    );
    return expiresAt;
  }

  generateOTP(ttlMinutes = 10) {
    const rawToken = randomBytes(4).readUInt32BE(0);
    const otp = (rawToken % 1000000).toString().padStart(6, "0");
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    return { otp, expiresAt };
  }
}

export const authservice = new AuthService(jwtLibary, bcryptLibary);
