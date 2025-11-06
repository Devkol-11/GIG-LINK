import { ContractRepository } from "../../infrastructure/ContractRepository.js";
import { ApplicationRepository } from "../../infrastructure/ApplicationRepository.js";
import { GigRepository } from "../../infrastructure/GigRepository.js";
import { Contract } from "../../domain/entities/Contract.js";

import { BusinessError } from "@src/shared/errors/BusinessError.js";

//IMPORT IMPLEMENTATIONS
import { contractRepository } from "../../infrastructure/ContractRepository.js";
import { applicationRepository } from "../../infrastructure/ApplicationRepository.js";
import { gigRepository } from "../../infrastructure/GigRepository.js";

export class CreateContractUseCase {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly gigRepository: GigRepository
  ) {}

  async Execute(applicationId: string, creatorId: string, role: string) {
    // validate role
    if (role !== "CREATOR")
      throw BusinessError.unauthorized("Only creators can create contracts");

    // validate application to the contract
    const application = await this.applicationRepository.findById(
      applicationId
    );
    if (!application) throw BusinessError.notFound("Application not found");

    //additional validation for the gig on the application
    const gig = await this.gigRepository.findById(application.gigId);
    if (!gig) throw BusinessError.notFound("Gig not found");

    // Ensure the creator owns the gig
    if (gig.creatorId !== creatorId)
      throw BusinessError.unauthorized("You do not own this gig");

    // Only allow contract creation for accepted applications
    if (application.status !== "ACCEPTED")
      throw BusinessError.badRequest("Application must be accepted first");

    // create the contract
    const contract = Contract.create({
      gigId: gig.id,
      applicationId: application.id,
      creatorId: creatorId,
      freelancerId: application.freelancerId,
      startDate: new Date(),
      endDate: null,
    });

    //persist to the database
    const savedContract = await this.contractRepository.save(contract);
    return savedContract.getState();
  }
}

export const createContractUseCase = new CreateContractUseCase(
  contractRepository,
  applicationRepository,
  gigRepository
);
