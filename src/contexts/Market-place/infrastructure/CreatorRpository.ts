import { prisma } from "@core/database/prismaClient.js";
import { Creator } from "../domain/entities/Creator.js";
import { ICreatorRepository } from "../ports/ICreatorRepository.js";

export class CreatorRepository implements ICreatorRepository {
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

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ creators: Creator[]; total: number }> {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;

    const [records, total] = await Promise.all([
      prisma.creator.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.creator.count(),
    ]);

    const creators = records.map((r) => Creator.create({ ...r }));
    return { creators, total };
  }

  async delete(id: string): Promise<void> {
    await prisma.creator.delete({ where: { id } });
  }
}

export const creatorRepository = new CreatorRepository();
