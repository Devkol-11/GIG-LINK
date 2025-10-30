import { prisma } from "@core/database/prismaClient.js";
import { Freelancer } from "../domain/entities/Freelancer.js";
import { IFreelancerRepository } from "../domain/interfaces/IFreelancerRepository.js";

export class PrismaFreelancerRepository implements IFreelancerRepository {
  async save(freelancer: Freelancer): Promise<Freelancer> {
    const data = freelancer.getState();

    await prisma.freelancer.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return Freelancer.create({ ...data });
  }

  async findById(id: string): Promise<Freelancer | null> {
    const record = await prisma.freelancer.findUnique({ where: { id } });
    return record ? Freelancer.create({ ...record }) : null;
  }

  async findByUserId(userId: string): Promise<Freelancer | null> {
    const record = await prisma.freelancer.findUnique({ where: { userId } });
    return record ? Freelancer.create({ ...record }) : null;
  }

  async findAll(): Promise<Freelancer[]> {
    const records = await prisma.freelancer.findMany();
    return records.map((r) => Freelancer.create({ ...r }));
  }

  async delete(id: string): Promise<void> {
    await prisma.freelancer.delete({ where: { id } });
  }
}
