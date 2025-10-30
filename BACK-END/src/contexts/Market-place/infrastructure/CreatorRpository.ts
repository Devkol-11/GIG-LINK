import { prisma } from "@core/database/prismaClient.js";
import { Creator } from "../domain/entities/Creator.js";
import { ICreatorRepository } from "../domain/interfaces/ICreatorRepository.js";

export class PrismaCreatorRepository implements ICreatorRepository {
  async save(creator: Creator): Promise<Creator> {
    const data = creator.getState();

    await prisma.creator.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return Creator.create({ ...data });
  }

  async findById(id: string): Promise<Creator | null> {
    const record = await prisma.creator.findUnique({ where: { id } });
    return record ? Creator.create({ ...record }) : null;
  }

  async findByUserId(userId: string): Promise<Creator | null> {
    const record = await prisma.creator.findUnique({ where: { userId } });
    return record ? Creator.create({ ...record }) : null;
  }

  async findAll(): Promise<Creator[]> {
    const records = await prisma.creator.findMany();
    return records.map((r) => Creator.create({ ...r }));
  }

  async delete(id: string): Promise<void> {
    await prisma.creator.delete({ where: { id } });
  }
}
