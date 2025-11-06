import { prisma } from "@core/database/prismaClient.js";
import { Application } from "../domain/entities/Application.js";
import { IApplicationRepository } from "../ports/IApplicationRepository.js";

export class ApplicationRepository implements IApplicationRepository {
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

  async findByGigId(
    gigId: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ applications: Application[]; total: number }> {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;

    const [records, total] = await Promise.all([
      prisma.application.findMany({
        where: { gigId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where: { gigId } }),
    ]);

    const applications = records.map((r) => Application.create({ ...r }));
    return { applications, total };
  }

  async findByFreelancerId(
    freelancerId: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ applications: Application[]; total: number }> {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;

    const [records, total] = await Promise.all([
      prisma.application.findMany({
        where: { freelancerId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where: { freelancerId } }),
    ]);

    const applications = records.map((r) => Application.create({ ...r }));
    return { applications, total };
  }

  async findByGigIds(
    gigIds: string[],
    options?: { skip?: number; take?: number }
  ): Promise<{ applications: Application[]; total: number }> {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;

    const [records, total] = await Promise.all([
      prisma.application.findMany({
        where: { gigId: { in: gigIds } },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({
        where: { gigId: { in: gigIds } },
      }),
    ]);

    const applications = records.map((r) => Application.create({ ...r }));
    return { applications, total };
  }

  async findByGigAndFreelancer(
    gigId: string,
    freelancerId: string
  ): Promise<Application | null> {
    const record = await prisma.application.findFirst({
      where: { gigId, freelancerId },
    });
    return record ? Application.create({ ...record }) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ applications: Application[]; total: number }> {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;

    const [records, total] = await Promise.all([
      prisma.application.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count(),
    ]);

    const applications = records.map((r) => Application.create({ ...r }));
    return { applications, total };
  }

  async update(application: Application): Promise<Application> {
    const data = application.getState();

    const updatedRecord = await prisma.application.update({
      where: { id: data.id },
      data,
    });

    return Application.create({ ...updatedRecord });
  }

  async delete(id: string): Promise<void> {
    await prisma.application.delete({ where: { id } });
  }
}

export const applicationRepository = new ApplicationRepository();
