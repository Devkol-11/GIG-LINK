import { prisma } from "@core/database/prismaClient.js";
import { Gig } from "../domain/entities/Gig.js";
import { IGigRepository } from "../ports/IGigRepository.js";

export class GigRepository implements IGigRepository {
  async save(gig: Gig): Promise<Gig> {
    const data = gig.getState();

    const record = await prisma.gig.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return Gig.toEntity(record);
  }

  async findById(id: string): Promise<Gig | null> {
    const record = await prisma.gig.findUnique({ where: { id } });
    return record ? Gig.toEntity(record) : null;
  }

  async findByCreatorId(
    creatorId: string,
    options: { skip?: number; take?: number } = {}
  ): Promise<{ gigs: Gig[]; total: number }> {
    const { skip = 0, take = 10 } = options;

    // Query paginated data + total count (in parallel)
    const [records, total] = await Promise.all([
      prisma.gig.findMany({
        where: { creatorId },
        skip,
        take,
        orderBy: { createdAt: "desc" }, // newest first
      }),
      prisma.gig.count({ where: { creatorId } }),
    ]);
    const gigs = records.map((record) => Gig.toEntity(record));
    return {
      gigs,
      total,
    };
  }

  async findAll(
    options: { skip?: number; take?: number } = {}
  ): Promise<{ gigs: Gig[]; totalValue: number }> {
    const { skip = 0, take = 10 } = options;

    const [records, total] = await Promise.allSettled([
      prisma.gig.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.gig.count(),
    ]);

    const recordsResult = records.status === "fulfilled" ? records.value : [];
    const totalValue = total.status === "fulfilled" ? total.value : 0;

    const gigs = recordsResult.map((record) => Gig.toEntity(record));
    return {
      gigs,
      totalValue,
    };
  }

  async update(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      price: number;
      category: string;
      tags: string[];
      deadline: Date;
    }>
  ): Promise<Gig> {
    const record = await prisma.gig.update({
      where: { id },
      data: updates,
    });

    return Gig.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.gig.delete({ where: { id } });
  }
}

export const gigRepository = new GigRepository();
