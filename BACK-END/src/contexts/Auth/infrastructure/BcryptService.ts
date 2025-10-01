import bcrypt from "bcrypt";
import { passwordHasher } from "../domain/services/AuthService";

export class BcryptLibary implements passwordHasher {
  constructor(private readonly saltRounds: number) {}

  async hash(plainPassoword: string): Promise<string> {
    return await bcrypt.hash(plainPassoword, this.saltRounds);
  }

  async compare(
    plainPassoword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassoword, hashedPassword);
  }
}
