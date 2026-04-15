import { usersRepository } from "../repositories/users.repository.js";
import { AppError } from "../utils/error.js";
function mapProfileResult(user) {
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
    async createProfile(userId, data) {
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
    async getProfile(userId) {
        const user = await usersRepository.getProfileByUserId(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return mapProfileResult(user);
    },
    async updateProfile(userId, data) {
        const user = await usersRepository.findUserById(userId);
        if (!user?.profile) {
            throw new AppError("Profile not found", 404);
        }
        return usersRepository.updateProfile(userId, data);
    },
    async uploadAvatar(userId, data) {
        const user = await usersRepository.findUserById(userId);
        if (!user?.profile) {
            throw new AppError("Profile not found", 404);
        }
        return usersRepository.updateAvatar(userId, data.avatarUrl);
    },
};
