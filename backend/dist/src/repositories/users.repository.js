import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { ROLE_USER } from "../../prisma/generated/prisma/enums.js";
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({});
globalForPrisma.prisma = prisma;
export const usersRepository = {
    findUserById(userId) {
        return prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                creatorProfile: true,
                freelancerProfile: true,
            },
        });
    },
    upsertProfile(userId, data) {
        return prisma.userProfile.upsert({
            where: { userId },
            create: {
                id: crypto.randomUUID(),
                userId,
                bio: data.bio,
                skills: data.skills,
                interests: data.interests ?? [],
                location: data.location,
            },
            update: {
                bio: data.bio,
                skills: data.skills,
                interests: data.interests ?? [],
                location: data.location,
            },
        });
    },
    ensureRoleProfile(userId, role, data) {
        if (role === ROLE_USER.FREELANCER) {
            return prisma.freelancer.upsert({
                where: { userId },
                create: {
                    id: crypto.randomUUID(),
                    userId,
                    bio: data.bio,
                    skills: data.skills,
                },
                update: {
                    bio: data.bio,
                    skills: data.skills,
                },
            });
        }
        return prisma.creator.upsert({
            where: { userId },
            create: {
                id: crypto.randomUUID(),
                userId,
            },
            update: {},
        });
    },
    getProfileByUserId(userId) {
        return prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                creatorProfile: true,
                freelancerProfile: true,
            },
        });
    },
    updateProfile(userId, data) {
        return prisma.userProfile.update({
            where: { userId },
            data: {
                ...(data.bio !== undefined ? { bio: data.bio } : {}),
                ...(data.skills !== undefined ? { skills: data.skills } : {}),
                ...(data.location !== undefined ? { location: data.location } : {}),
                ...(data.interests !== undefined ? { interests: data.interests } : {}),
            },
        });
    },
    updateAvatar(userId, avatarUrl) {
        return prisma.userProfile.update({
            where: { userId },
            data: { avatarUrl },
        });
    },
};
