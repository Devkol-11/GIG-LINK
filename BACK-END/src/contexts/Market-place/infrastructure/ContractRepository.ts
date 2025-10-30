import { prisma } from "@core/database/prismaClient.js";
import { Contract } from "../domain/entities/Contract.js";
import { IContractRepository } from "../domain/interfaces/IContractRepository.js";

export class PrismaContractRepository implements IContractRepository {
  async save(contract: Contract): Promise<Contract> {
    const data = contract.getState();

    await prisma.contract.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return Contract.create({ ...data });
  }

  async findById(id: string): Promise<Contract | null> {
    const record = await prisma.contract.findUnique({ where: { id } });
    return record ? Contract.create({ ...record }) : null;
  }

  async findByGigId(gigId: string): Promise<Contract | null> {
    const record = await prisma.contract.findUnique({ where: { gigId } });
    return record ? Contract.create({ ...record }) : null;
  }

  async findByApplicationId(applicationId: string): Promise<Contract | null> {
    const record = await prisma.contract.findUnique({
      where: { applicationId },
    });
    return record ? Contract.create({ ...record }) : null;
  }

  async findAll(): Promise<Contract[]> {
    const records = await prisma.contract.findMany();
    return records.map((r) => Contract.create({ ...r }));
  }

  async delete(id: string): Promise<void> {
    await prisma.contract.delete({ where: { id } });
  }
}
