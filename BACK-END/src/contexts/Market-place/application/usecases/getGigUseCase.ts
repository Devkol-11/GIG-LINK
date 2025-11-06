// src/modules/marketplace/application/usecases/getGigUseCase.ts
import { GigRepository } from "../../infrastructure/GigRepository.js";
import { gigRepository } from "../../infrastructure/GigRepository.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class GetGigUseCase {
  constructor(private gigRepository: GigRepository) {}

  async Execute(id: string) {
    const gig = await this.gigRepository.findById(id);

    if (!gig) {
      throw BusinessError.notFound("Gig not found");
    }

    return gig.getState();
  }
}

export const getGigUseCase = new GetGigUseCase(gigRepository);
