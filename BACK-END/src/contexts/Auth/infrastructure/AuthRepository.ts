import { IAuthRepository } from "../ports/AuthRepository.js";
import { prisma } from "@core/database/prismaClient.js";
import { logger } from "@core/logging/winston.js";
import type { User } from "@prisma/client";
import { RefreshToken } from "@prisma/client";

export class AuthRepository implements IAuthRepository {
  constructor() {}

  async save(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const savedUser = await prisma.user.create({
      data: userData,
    });
    return savedUser;
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async update(email: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: updateData,
    });
    return updatedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return record;
  }

  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return record;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const record = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    return !!record;
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }
}

export const authRepository = new AuthRepository();
