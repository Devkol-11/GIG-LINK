import bcrypt from "bcrypt";
import { IpasswordHasher } from "../domain/interfaces/PasswordHasher.ts";
class BcryptLibary implements IpasswordHasher {
  constructor(private readonly saltRounds = 12) {}

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

export const bcryptLibary = new BcryptLibary(10);
