import { Otp } from "@prisma/client";

export interface IOtpRepository {
  create(userId: string, token: string, expiredAt: Date): Promise<Otp>;
  findByToken(token: string): Promise<Otp | null>;
  markAsUsed(token: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
