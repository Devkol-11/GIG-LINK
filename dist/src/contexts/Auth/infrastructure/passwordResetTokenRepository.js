'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.passwordResetTokenRepository = exports.PasswordResetTokenRepository =
        void 0;
const prismaClient_1 = require('@core/database/prismaClient');
const PasswordResetToken_1 = require('../domain/entities/PasswordResetToken');
const cuid2_1 = require('@paralleldrive/cuid2');
const generateOTP_1 = require('../domain/utils/generateOTP');
class PasswordResetTokenRepository {
        constructor() {}
        toDomainEntity(record) {
                return new PasswordResetToken_1.PasswordResetToken(
                        record.id,
                        record.userId,
                        record.token,
                        record.used,
                        record.createdAt,
                        record.expiresAt
                );
        }
        toPersistence(entity) {
                return {
                        id: entity.id,
                        userId: entity.userId,
                        token: entity.token,
                        used: entity.used,
                        createdAt: entity.createdAt,
                        expiresAt: entity.expiresAt
                };
        }
        async create(userId, ttlMinutes = 15) {
                const now = new Date();
                const expiresAt = new Date(
                        now.getTime() + ttlMinutes * 60 * 1000
                );
                const entity = new PasswordResetToken_1.PasswordResetToken(
                        (0, cuid2_1.createId)(),
                        userId,
                        (0, generateOTP_1.generateOtp)(),
                        false,
                        now,
                        expiresAt
                );
                const record =
                        await prismaClient_1.prisma.passwordResetToken.create({
                                data: this.toPersistence(entity)
                        });
                return this.toDomainEntity(record);
        }
        async findByToken(token) {
                const record =
                        await prismaClient_1.prisma.passwordResetToken.findUnique(
                                {
                                        where: { token }
                                }
                        );
                return record ? this.toDomainEntity(record) : null;
        }
        async markAsUsed(token) {
                await prismaClient_1.prisma.passwordResetToken.update({
                        where: { token },
                        data: { used: true }
                });
        }
        async deleteAllForUser(userId) {
                await prismaClient_1.prisma.passwordResetToken.deleteMany({
                        where: { userId }
                });
        }
}
exports.PasswordResetTokenRepository = PasswordResetTokenRepository;
exports.passwordResetTokenRepository = new PasswordResetTokenRepository();
