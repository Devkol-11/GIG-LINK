import { Otp } from "@prisma/client";
import { prisma } from "@core/database/prismaClient";
import { IOtpRepository } from "../domain/interfaces/OtpRepository";

export class OtpRepository implements IOtpRepository {
  constructor() {}

  async create(userId: string, token: string, expiresAt: Date): Promise<Otp> {
    const otpRecord = await prisma.otp.create({
      data: {
        userId,
        token,
        used: false,
        createdAt: new Date(),
        expiresAt,
      },
    });

    return otpRecord;
  }

  async findByToken(token: string): Promise<Otp | null> {
    const record = await prisma.otp.findUnique({
      where: { token },
    });
    return record;
  }

  async markAsUsed(token: string): Promise<void> {
    await prisma.otp.update({
      where: { token },
      data: { used: true },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await prisma.otp.deleteMany({
      where: { userId },
    });
  }
}

export const otpRepository = new OtpRepository();
