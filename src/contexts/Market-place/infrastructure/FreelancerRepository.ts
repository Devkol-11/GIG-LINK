import { prisma } from "@core/database/prismaClient.js";
import { Freelancer } from "../domain/entities/Freelancer.js";
import { IFreelancerRepository } from "../ports/IFreelancerRepository.js";

export class FreelancerRepository implements IFreelancerRepository {
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

  async findAll(
    options: { skip?: number; take?: number } = {}
  ): Promise<{ freelancers: Freelancer[]; total: number }> {
    const { skip = 0, take = 10 } = options;

    // Fetch data and total count in parallel
    const [records, total] = await Promise.all([
      prisma.freelancer.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.freelancer.count(),
    ]);

    const freelancers = records.map((r) => Freelancer.create({ ...r }));
    return {
      freelancers,
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.freelancer.delete({ where: { id } });
  }
}

export const freelancerRepository = new FreelancerRepository();
