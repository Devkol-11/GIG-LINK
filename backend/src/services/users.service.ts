import { usersRepository } from "../repositories/users.repository.js";
import { AppError } from "../utils/error.js";

function mapProfileResult(user: NonNullable<Awaited<ReturnType<typeof usersRepository.getProfileByUserId>>>) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    profile: user.profile,
    creatorProfile: user.creatorProfile,
    freelancerProfile: user.freelancerProfile,
  };
}

export const usersService = {
  async createProfile(
    userId: string,
    data: {
      bio?: string;
      skills: string[];
      portfolio?: string;
      hourlyRate?: number;
      location?: string;
      interests?: string[];
    },
  ) {
    const user = await usersRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const profile = await usersRepository.upsertProfile(userId, {
      ...data,
      location: data.location ?? "Remote",
    });

    await usersRepository.ensureRoleProfile(userId, user.role, {
      bio: data.bio,
      skills: data.skills,
    });

    return profile;
  },

  async getProfile(userId: string) {
    const user = await usersRepository.getProfileByUserId(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return mapProfileResult(user);
  },

  async updateProfile(
    userId: string,
    data: {
      bio?: string;
      skills?: string[];
      portfolio?: string;
      hourlyRate?: number;
      location?: string;
      interests?: string[];
    },
  ) {
    const user = await usersRepository.findUserById(userId);

    if (!user?.profile) {
      throw new AppError("Profile not found", 404);
    }

    return usersRepository.updateProfile(userId, data);
  },

  async uploadAvatar(userId: string, data: { avatarUrl: string }) {
    const user = await usersRepository.findUserById(userId);

    if (!user?.profile) {
      throw new AppError("Profile not found", 404);
    }

    return usersRepository.updateAvatar(userId, data.avatarUrl);
  },
};
