import bcrypt from "bcrypt";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { ROLE_USER } from "../../prisma/generated/prisma/enums.js";
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({});
globalForPrisma.prisma = prisma;
export const authRepository = {
    findUserByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                creatorProfile: true,
                freelancerProfile: true,
                profile: true,
            },
        });
    },
    createUser(data) {
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                isSuspended: false,
                ...(data.role === ROLE_USER.CREATOR
                    ? {
                        creatorProfile: {
                            create: {
                                id: crypto.randomUUID(),
                            },
                        },
                    }
                    : {
                        freelancerProfile: {
                            create: {
                                id: crypto.randomUUID(),
                                skills: [],
                            },
                        },
                    }),
            },
            include: {
                creatorProfile: true,
                freelancerProfile: true,
            },
        });
    },
    storeRefreshToken(userId, refreshToken) {
        return prisma.refresh_Token_User.create({
            data: {
                userId,
                tokenHash: bcrypt.hashSync(refreshToken, 10),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
        });
    },
    upsertOtp(userId, token) {
        return prisma.otp.create({
            data: {
                userId,
                token,
                expiresAt: new Date(Date.now() + 1000 * 60 * 15),
            },
        });
    },
    findValidOtp(email, token) {
        return prisma.otp.findFirst({
            where: {
                token,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
                user: {
                    email,
                },
            },
            include: {
                user: true,
            },
        });
    },
    updatePassword(userId, passwordHash) {
        return prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    },
    markOtpUsed(otpId) {
        return prisma.otp.update({
            where: { id: otpId },
            data: { used: true },
        });
    },
};
