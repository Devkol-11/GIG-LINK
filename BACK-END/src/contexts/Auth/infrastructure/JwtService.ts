import jwt from "jsonwebtoken";
import { ITokenGenerator } from "../domain/interfaces/TokenGenerator";
import { config } from "@core/config/env";

class JwtLibary implements ITokenGenerator {
  constructor(
    private accessSecretKey: string,
    private refreshSecretKey: string
  ) {}

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.accessSecretKey, {
      expiresIn: 15,
    });
  }
  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refreshSecretKey, {
      expiresIn: 15,
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessSecretKey);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecretKey);
  }
}

export const jwtLibary = new JwtLibary(
  config.ACCESS_TOKEN_SECRET,
  config.REFRESH_TOKEN_SECRET
);
