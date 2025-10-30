import { prisma } from "@core/database/prismaClient.js";
import { Gig } from "../domain/entities/Gig.js";
import { IGigRepository } from "../domain/interfaces/IGigRepository.js";

export class PrismaGigRepository implements IGigRepository {
  async save(gig: Gig): Promise<Gig> {
    const data = gig.getState();

    await prisma.gig.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return Gig.create({ ...data });
  }

  async findById(id: string): Promise<Gig | null> {
    const record = await prisma.gig.findUnique({ where: { id } });
    return record ? Gig.create({ ...record }) : null;
  }

  async findAll(): Promise<Gig[]> {
    const records = await prisma.gig.findMany();
    return records.map((r) => Gig.create({ ...r }));
  }

  async delete(id: string): Promise<void> {
    await prisma.gig.delete({ where: { id } });
  }
}
