import { ApplicationRepository } from "../../infrastructure/ApplicationRepository.js";
import { GigRepository } from "../../infrastructure/GigRepository.js";
import { applicationRepository } from "../../infrastructure/ApplicationRepository.js";
import { gigRepository } from "../../infrastructure/GigRepository.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";
import { Application } from "../../domain/entities/Application.js";

export class ListApplicationsUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly gigRepository: GigRepository
  ) {}

  async Execute(
    userId: string,
    role: "CREATOR" | "FREELANCER",
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;
    let applications: Application[] = [];
    let total = 0;

    switch (role) {
      case "FREELANCER":
        //gets applications array and total count from application repository
        ({ applications, total } =
          await this.applicationRepository.findByFreelancerId(userId, {
            skip,
            take: limit,
          }));
        break;

      case "CREATOR":
        //get gigs by a creator as an array from the gig repository
        const { gigs } = await this.gigRepository.findByCreatorId(userId);
        if (!gigs.length)
          throw BusinessError.notFound("No gigs found for this creator");

        const gigIds = gigs.map((gig) => gig.id);
        ({ applications, total } =
          await this.applicationRepository.findByGigIds(gigIds, {
            skip,
            take: limit,
          }));
        break;
    }

    // Return both data and metadata
    return {
      applications: applications.map((application) => application.getState()),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const listApplicationsUseCase = new ListApplicationsUseCase(
  applicationRepository,
  gigRepository
);
