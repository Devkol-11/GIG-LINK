import { UserProfile } from "@prisma/client";

export interface IProfileRepository {
  findUserById(userId: string): Promise<UserProfile | null>;
  findProfileById(profileId: string): Promise<UserProfile | null>;
  createUserProfile(data: Partial<UserProfile>): Promise<UserProfile | null>;
  updateUserProfile(
    userId: string,
    updateData: Partial<UserProfile>
  ): Promise<UserProfile | null>;
}
