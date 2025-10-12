// src/contexts/Auth/infrastructure/PrismaRepository.ts
import { User } from "../domain/entities/User";
import { IAuthRepository } from "../domain/interfaces/AuthRepository";
import { prisma } from "@core/database/prismaClient";
import { logger } from "@core/logging/winston";

export class PrismaRepository implements IAuthRepository {
  constructor() {}

  async create(userData: User): Promise<User> {
    const persistenceData = this.toPersistence(userData);
    const createUserRecord = await prisma.user.create({
      data: persistenceData,
    });

    return this.toDomainEntity(createUserRecord);
  }

  async update(user: User): Promise<User> {
    const persistenceData = this.toPersistence(user);
    const updateUserRecord = await prisma.user.update({
      where: { email: persistenceData.email },
      data: persistenceData,
    });
    return this.toDomainEntity(updateUserRecord);
  }

  async save(user: User): Promise<User> {
    const persistenceData = this.toPersistence(user);
    if (!persistenceData.id) {
      const createUserRecord = await prisma.user.create({
        data: persistenceData,
      });
      return this.toDomainEntity(createUserRecord);
    }
    const updateUserData = await prisma.user.update({
      where: { id: persistenceData.id },
      data: persistenceData,
    });
    return this.toDomainEntity(updateUserData);
  }

  async findByEmail(email: string): Promise<User | null> {
    logger.info("[Repo] findByEmail", { email });

    const userData = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!userData) {
      return null;
    }
    logger.info("[Repo] findByEmail result", { userData });
    return this.toDomainEntity(userData);
  }

  async findById(id: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({ where: { id } });
    logger.info("[Repo] findById result", { userData });
    if (!userData) {
      return null;
    }
    return this.toDomainEntity(userData);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  private toDomainEntity(persisteDdata: any): User {
    const user = User.rehydrate({
      id: persisteDdata.id,
      email: persisteDdata.email,
      password: persisteDdata.passwordHash, // correct mapping
      firstName: persisteDdata.firstName,
      lastName: persisteDdata.lastName,
      phoneNumber: persisteDdata.phoneNumber,
      isEmailVerified: !!persisteDdata.isEmailVerified,
      createdAt: persisteDdata.createdAt,
      updatedAt: persisteDdata.updatedAt,
    });
    return user;
  }

  private toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const prismaRepository = new PrismaRepository();
