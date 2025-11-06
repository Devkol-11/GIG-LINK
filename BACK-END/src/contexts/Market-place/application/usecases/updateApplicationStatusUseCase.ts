// src/modules/marketplace/application/usecases/updateApplicationUseCase.ts
import { ApplicationRepository } from "../../infrastructure/ApplicationRepository.js";
import { ApplicationStatus } from "../../domain/entities/Application.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

// IMPORT IMPLEMENTATION
import { applicationRepository } from "../../infrastructure/ApplicationRepository.js";

export class UpdateApplicationUseCase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async Execute(
    applicationId: string,
    updates: Partial<{ status: string; coverLetter: string }>,
    role: "CREATOR" | "FREELANCER"
  ) {
    // Fetch the application resource from the repository
    const application = await this.applicationRepository.findById(
      applicationId
    );
    if (!application) throw BusinessError.notFound("Application not found");

    // Role-based restrictions
    if (updates.status && role !== "CREATOR") {
      throw BusinessError.unauthorized("Only creators can update the status");
    }

    if (updates.coverLetter && role !== "FREELANCER") {
      throw BusinessError.unauthorized(
        "Only freelancers can update the cover letter"
      );
    }

    // Validate updates status fields
    const applicationStatus = Object.values(ApplicationStatus);

    if (!applicationStatus.includes(updates.status as ApplicationStatus)) {
      throw new BusinessError("Inavalid status");
    }

    //Apply status update
    if (updates.status)
      application.updateStatus(updates.status as ApplicationStatus);

    //Apply coverLetter update
    if (updates.coverLetter) application.updateCoverLetter(updates.coverLetter);

    return this.applicationRepository.save(application);
  }
}

export const updateApplicationUseCase = new UpdateApplicationUseCase(
  applicationRepository
);
