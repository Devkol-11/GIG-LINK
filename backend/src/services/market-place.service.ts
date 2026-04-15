import {
  ApplicationStatus,
  ContractStatus,
  ROLE_USER,
} from "../../prisma/generated/prisma/enums.js";
import { marketPlaceRepository } from "../repositories/market-place.repository.js";
import { AppError } from "../utils/error.js";

export const marketPlaceService = {
  async createGig(
    userId: string,
    role: ROLE_USER,
    data: {
      title: string;
      description: string;
      price: number;
      category: string;
      deliveryTime: number;
      skills: string[];
    },
  ) {
    if (role !== ROLE_USER.CREATOR) {
      throw new AppError("Only creators can create gigs", 403);
    }

    const creator = await marketPlaceRepository.findCreatorByUserId(userId);

    if (!creator) {
      throw new AppError("Creator profile not found", 404);
    }

    return marketPlaceRepository.createGig(creator.id, data);
  },

  async listGigs(page: number, limit: number) {
    const [items, total] = await Promise.all([
      marketPlaceRepository.listGigs(page, limit),
      marketPlaceRepository.countGigs(),
    ]);

    return {
      items,
      pagination: { page, limit, total },
    };
  },

  async getGig(id: string) {
    const gig = await marketPlaceRepository.getGigById(id);

    if (!gig) {
      throw new AppError("Gig not found", 404);
    }

    return gig;
  },

  async updateGig(
    userId: string,
    role: ROLE_USER,
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
    if (role !== ROLE_USER.CREATOR) {
      throw new AppError("Only creators can update gigs", 403);
    }

    const gig = await marketPlaceRepository.getGigById(id);

    if (!gig) {
      throw new AppError("Gig not found", 404);
    }

    if (gig.creator.userId !== userId) {
      throw new AppError("You can only update your own gigs", 403);
    }

    return marketPlaceRepository.updateGig(id, data);
  },

  async deleteGig(userId: string, role: ROLE_USER, id: string) {
    if (role !== ROLE_USER.CREATOR) {
      throw new AppError("Only creators can delete gigs", 403);
    }

    const gig = await marketPlaceRepository.getGigById(id);

    if (!gig) {
      throw new AppError("Gig not found", 404);
    }

    if (gig.creator.userId !== userId) {
      throw new AppError("You can only delete your own gigs", 403);
    }

    return marketPlaceRepository.deleteGig(id);
  },

  async createApplication(
    userId: string,
    role: ROLE_USER,
    data: {
      gigId: string;
      proposal: string;
      proposedPrice: number;
      estimatedDays: number;
    },
  ) {
    if (role !== ROLE_USER.FREELANCER) {
      throw new AppError("Only freelancers can apply to gigs", 403);
    }

    const freelancer = await marketPlaceRepository.findFreelancerByUserId(userId);
    const gig = await marketPlaceRepository.getGigById(data.gigId);

    if (!freelancer) {
      throw new AppError("Freelancer profile not found", 404);
    }

    if (!gig) {
      throw new AppError("Gig not found", 404);
    }

    return marketPlaceRepository.createApplication({
      gigId: data.gigId,
      freelancerId: freelancer.id,
      creatorId: gig.creatorId,
      proposal: `${data.proposal}\n\nProposed price: ${data.proposedPrice}\nEstimated days: ${data.estimatedDays}`,
    });
  },

  listApplications(userId: string, role: ROLE_USER) {
    return marketPlaceRepository.listApplicationsForUser(userId, role);
  },

  async updateApplicationStatus(
    userId: string,
    role: ROLE_USER,
    applicationId: string,
    status: "accepted" | "rejected",
  ) {
    if (role !== ROLE_USER.CREATOR) {
      throw new AppError("Only creators can update application status", 403);
    }

    const application = await marketPlaceRepository.getApplicationById(applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    const gig = await marketPlaceRepository.getGigById(application.gigId);

    if (!gig || gig.creator.userId !== userId) {
      throw new AppError("You can only update applications for your gigs", 403);
    }

    return marketPlaceRepository.updateApplicationStatus(
      applicationId,
      status === "accepted" ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED,
    );
  },

  async createContract(
    userId: string,
    role: ROLE_USER,
    data: { applicationId: string; terms: string },
  ) {
    if (role !== ROLE_USER.CREATOR) {
      throw new AppError("Only creators can create contracts", 403);
    }

    const application = await marketPlaceRepository.getApplicationById(data.applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    const gig = await marketPlaceRepository.getGigById(application.gigId);

    if (!gig || gig.creator.userId !== userId) {
      throw new AppError("You can only create contracts for your gigs", 403);
    }

    if (application.status !== ApplicationStatus.ACCEPTED) {
      throw new AppError("Application must be accepted before creating a contract", 400);
    }

    if (application.contract) {
      throw new AppError("Contract already exists for this application", 400);
    }

    void data.terms;

    return marketPlaceRepository.createContract({
      applicationId: application.id,
      gigId: application.gigId,
      creatorId: gig.creator.userId,
      freelancerId: application.freelancer.userId,
      amountKobo: Math.round(gig.price * 100),
    });
  },

  async getContract(userId: string, id: string) {
    const contract = await marketPlaceRepository.getContractById(id);

    if (!contract) {
      throw new AppError("Contract not found", 404);
    }

    if (contract.creatorId !== userId && contract.freelancerId !== userId) {
      throw new AppError("You do not have access to this contract", 403);
    }

    return contract;
  },

  async updateContractStatus(
    userId: string,
    role: ROLE_USER,
    id: string,
    status: "active" | "completed" | "cancelled",
  ) {
    const contract = await marketPlaceRepository.getContractById(id);

    if (!contract) {
      throw new AppError("Contract not found", 404);
    }

    if (contract.creatorId !== userId && contract.freelancerId !== userId) {
      throw new AppError("You do not have access to this contract", 403);
    }

    if (role !== ROLE_USER.CREATOR && status === "cancelled") {
      throw new AppError("Only creators can cancel contracts", 403);
    }

    const nextStatus =
      status === "active"
        ? ContractStatus.ACTIVE
        : status === "completed"
          ? ContractStatus.COMPLETED
          : ContractStatus.CANCELLED;

    return marketPlaceRepository.updateContractStatus(id, nextStatus);
  },
};
