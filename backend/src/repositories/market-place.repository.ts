import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import {
  ApplicationStatus,
  ContractStatus,
  GigStatus,
  ROLE_USER,
} from "../../prisma/generated/prisma/enums.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient({} as never);
globalForPrisma.prisma = prisma;

export const marketPlaceRepository = {
  findCreatorByUserId(userId: string) {
    return prisma.creator.findUnique({ where: { userId } });
  },

  findFreelancerByUserId(userId: string) {
    return prisma.freelancer.findUnique({ where: { userId } });
  },

  createGig(
    creatorId: string,
    data: {
      title: string;
      description: string;
      price: number;
      category: string;
      deliveryTime: number;
      skills: string[];
    },
  ) {
    return prisma.gig.create({
      data: {
        id: crypto.randomUUID(),
        creatorId,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.skills,
        price: data.price,
        deadline: new Date(Date.now() + data.deliveryTime * 24 * 60 * 60 * 1000),
        status: GigStatus.ACTIVE,
      },
    });
  },

  listGigs(page: number, limit: number) {
    return prisma.gig.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  countGigs() {
    return prisma.gig.count();
  },

  getGigById(id: string) {
    return prisma.gig.findUnique({
      where: { id },
      include: {
        creator: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  updateGig(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      price: number;
      category: string;
      deliveryTime: number;
      skills: string[];
    }>,
  ) {
    return prisma.gig.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.skills !== undefined ? { tags: data.skills } : {}),
        ...(data.deliveryTime !== undefined
          ? { deadline: new Date(Date.now() + data.deliveryTime * 24 * 60 * 60 * 1000) }
          : {}),
      },
    });
  },

  deleteGig(id: string) {
    return prisma.gig.delete({ where: { id } });
  },

  createApplication(
    data: {
      gigId: string;
      freelancerId: string;
      creatorId: string;
      proposal: string;
    },
  ) {
    return prisma.application.create({
      data: {
        id: crypto.randomUUID(),
        gigId: data.gigId,
        freelancerId: data.freelancerId,
        creatorId: data.creatorId,
        coverLetter: data.proposal,
        updatedAt: new Date(),
      },
    });
  },

  listApplicationsForUser(userId: string, role: ROLE_USER) {
    if (role === ROLE_USER.CREATOR) {
      return prisma.application.findMany({
        where: {
          gig: {
            creator: {
              userId,
            },
          },
        },
        include: {
          gig: true,
          freelancer: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    return prisma.application.findMany({
      where: {
        freelancer: {
          userId,
        },
      },
      include: {
        gig: true,
      },
    });
  },

  getApplicationById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        gig: true,
        freelancer: true,
        contract: true,
      },
    });
  },

  updateApplicationStatus(id: string, status: ApplicationStatus) {
    return prisma.application.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  },

  createContract(data: {
    applicationId: string;
    gigId: string;
    creatorId: string;
    freelancerId: string;
    amountKobo: number;
  }) {
    return prisma.contract.create({
      data: {
        id: crypto.randomUUID(),
        applicationId: data.applicationId,
        gigId: data.gigId,
        creatorId: data.creatorId,
        freelancerId: data.freelancerId,
        amountKobo: data.amountKobo,
        currency: "NGN",
        startDate: new Date(),
        status: ContractStatus.ACTIVE,
      },
    });
  },

  getContractById(id: string) {
    return prisma.contract.findUnique({
      where: { id },
      include: {
        application: true,
        gig: true,
        escrowAccount: true,
      },
    });
  },

  updateContractStatus(id: string, status: ContractStatus) {
    return prisma.contract.update({
      where: { id },
      data: { status },
    });
  },
};
