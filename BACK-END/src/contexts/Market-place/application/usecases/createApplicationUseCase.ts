import { GigRepository } from "../../infrastructure/GigRepository.js";

import { gigRepository } from "../../infrastructure/GigRepository.js";

import { Application } from "../../domain/entities/Application.js";
import { createApplicationDTO } from "../dtos/createApplicationDTO.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

//IMPORT IMPLEMENTATIONS
import { applicationRepository } from "../../infrastructure/ApplicationRepository.js";
import { ApplicationRepository } from "../../infrastructure/ApplicationRepository.js";
export class CreateApplicationUseCase {
  constructor(
    private readonly gigRepository: GigRepository,
    private readonly applicationRepository: ApplicationRepository
  ) {}

  async Execute(data: createApplicationDTO) {
    const { gigId, freelancerId, coverLetter } = data;

    // Ensure gig resource exists
    const gig = await this.gigRepository.findById(gigId);
    if (!gig) throw BusinessError.notFound("Gig not found");

    // Prevent duplicate applications i.e ensure the freelancer has not already applied to this gig
    const existing = await this.applicationRepository.findByGigAndFreelancer(
      gigId,
      freelancerId
    );
    if (existing)
      throw BusinessError.conflict("You already applied for this gig");

    //confirm gig is not currently active
    if (gig.status === "ACTIVE")
      throw BusinessError.forbidden("unable to apply to this gig");

    // Create new Application entity
    const newApplication = Application.create({
      gigId,
      freelancerId,
      coverLetter,
    });

    // Persist to the database
    const savedApplication = await this.applicationRepository.save(
      newApplication
    );
    return savedApplication.getState();
  }
}

export const createApplicationUseCase = new CreateApplicationUseCase(
  gigRepository,
  applicationRepository
);
