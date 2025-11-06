import { User } from "@prisma/client";
import { RefreshToken } from "@prisma/client";

export interface IAuthRepository {
  save(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshToken>;
  update(email: string, updateData: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  updatePassword(userId: string, newPasswordHash: string): Promise<void>;
}
