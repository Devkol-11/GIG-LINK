import jwt from "jsonwebtoken";
import { TokenGenerator } from "../domain/services/AuthService";

export class JwtLibary implements TokenGenerator {
  constructor(private secretKey: string) {}

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: 15,
    });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secretKey);
  }
}
