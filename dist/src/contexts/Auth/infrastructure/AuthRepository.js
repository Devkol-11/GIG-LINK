"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const User_1 = require("../domain/entities/User");
const prismaClient_1 = require("@core/database/prismaClient");
const winston_1 = require("@core/logging/winston");
class AuthRepository {
    constructor() { }
    async create(entity) {
        const record = this.toPersistence(entity);
        const createdUser = await prismaClient_1.prisma.user.create({ data: record });
        return this.toDomainEntity(createdUser);
    }
    async update(entity) {
        const record = this.toPersistence(entity);
        const updatedUser = await prismaClient_1.prisma.user.update({
            where: { email: record.email },
            data: record,
        });
        return this.toDomainEntity(updatedUser);
    }
    async save(entity) {
        const record = this.toPersistence(entity);
        if (!record.id) {
            const createdUser = await prismaClient_1.prisma.user.create({ data: record });
            return this.toDomainEntity(createdUser);
        }
        const updatedUser = await prismaClient_1.prisma.user.update({
            where: { id: record.id },
            data: record,
        });
        return this.toDomainEntity(updatedUser);
    }
    async findByEmail(email) {
        winston_1.logger.info("[Repo] findByEmail", { email });
        const record = await prismaClient_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!record)
            return null;
        winston_1.logger.info("[Repo] findByEmail result", { record });
        return this.toDomainEntity(record);
    }
    async findById(id) {
        const record = await prismaClient_1.prisma.user.findUnique({ where: { id } });
        winston_1.logger.info("[Repo] findById result", { record });
        if (!record)
            return null;
        return this.toDomainEntity(record);
    }
    async existsByEmail(email) {
        const record = await prismaClient_1.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return !!record;
    }
    async updatePassword(userId, newPasswordHash) {
        await prismaClient_1.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });
        winston_1.logger.info("[Repo] updatePassword", { userId });
    }
    toDomainEntity(record) {
        return User_1.User.rehydrate({
            id: record.id,
            email: record.email,
            password: record.passwordHash,
            firstName: record.firstName,
            lastName: record.lastName,
            phoneNumber: record.phoneNumber,
            isEmailVerified: !!record.isEmailVerified,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }
    toPersistence(entity) {
        return {
            id: entity.id,
            email: entity.email,
            passwordHash: entity.password,
            firstName: entity.firstName,
            lastName: entity.lastName,
            phoneNumber: entity.phoneNumber,
            isEmailVerified: entity.isEmailVerified,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
