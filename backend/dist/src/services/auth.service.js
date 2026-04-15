import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLE_USER } from "../../prisma/generated/prisma/enums.js";
import { authRepository } from "../repositories/auth.repository.js";
import { AppError } from "../utils/error.js";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
function signAccessToken(user) {
    return jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { subject: user.id, expiresIn: "1h" });
}
function signRefreshToken(user) {
    return jwt.sign({ email: user.email, role: user.role }, JWT_REFRESH_SECRET, { subject: user.id, expiresIn: "7d" });
}
function sanitizeUser(user) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    };
}
async function registerUser(data, role) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
        throw new AppError("User with this email already exists", 400);
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await authRepository.createUser({ ...data, passwordHash, role });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await authRepository.storeRefreshToken(user.id, refreshToken);
    return {
        user: sanitizeUser(user),
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}
export const authService = {
    registerFreelancer(data) {
        return registerUser(data, ROLE_USER.FREELANCER);
    },
    registerCreator(data) {
        return registerUser(data, ROLE_USER.CREATOR);
    },
    async login(data) {
        const user = await authRepository.findUserByEmail(data.email);
        if (!user?.passwordHash) {
            throw new AppError("Invalid email or password", 401);
        }
        const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);
        if (!passwordMatches) {
            throw new AppError("Invalid email or password", 401);
        }
        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        await authRepository.storeRefreshToken(user.id, refreshToken);
        return {
            user: sanitizeUser(user),
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    },
    async forgotPassword(data) {
        const user = await authRepository.findUserByEmail(data.email);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await authRepository.upsertOtp(user.id, otp);
        return {
            email: user.email,
            otp,
        };
    },
    async resetPassword(data) {
        const record = await authRepository.findValidOtp(data.email, data.otp);
        if (!record) {
            throw new AppError("Invalid or expired OTP", 400);
        }
        const passwordHash = await bcrypt.hash(data.newPassword, 10);
        await authRepository.updatePassword(record.userId, passwordHash);
        await authRepository.markOtpUsed(record.id);
        return {
            email: record.user.email,
        };
    },
};
