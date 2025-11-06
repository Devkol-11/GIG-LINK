import { prisma } from "@core/database/prismaClient.js";
import { IProfileRepository } from "../ports/IProfileRepository.js";
import { UserProfile } from "@prisma/client";

export class ProfileRepository implements IProfileRepository {
  async findUserById(userId: string): Promise<UserProfile | null> {
    const record = await prisma.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });
    return record;
  }

  async findProfileById(profileId: string): Promise<UserProfile | null> {
    const record = await prisma.userProfile.findUnique({
      where: {
        id: profileId,
      },
    });
    return record;
  }

  async createUserProfile(
    data: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
  ): Promise<UserProfile | null> {
    const record = await prisma.userProfile.create({ data });
    return record;
  }

  async updateUserProfile(
    profileId: string,
    updateData: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    const record = await prisma.userProfile.update({
      where: { id: profileId },
      data: updateData,
    });
    return record;
  }
}

export const profileRepository = new ProfileRepository();
