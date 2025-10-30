import { prisma } from "@core/database/prismaClient.js";
import { Application } from "../domain/entities/Application.js";
import { IApplicationRepository } from "../domain/interfaces/IApplicationRepository.js";

export class PrismaApplicationRepository implements IApplicationRepository {
  async save(application: Application): Promise<Application> {
    const data = application.getState();

    await prisma.application.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return Application.create({ ...data });
  }

  async findById(id: string): Promise<Application | null> {
    const record = await prisma.application.findUnique({ where: { id } });
    return record ? Application.create({ ...record }) : null;
  }

  async findByGigId(gigId: string): Promise<Application[]> {
    const records = await prisma.application.findMany({ where: { gigId } });
    return records.map((r) => Application.create({ ...r }));
  }

  async findByFreelancerId(freelancerId: string): Promise<Application[]> {
    const records = await prisma.application.findMany({
      where: { freelancerId },
    });
    return records.map((r) => Application.create({ ...r }));
  }

  async findAll(): Promise<Application[]> {
    const records = await prisma.application.findMany();
    return records.map((r) => Application.create({ ...r }));
  }

  async delete(id: string): Promise<void> {
    await prisma.application.delete({ where: { id } });
  }
}
