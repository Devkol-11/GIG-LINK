// src/modules/marketplace/application/usecases/deleteGigUseCase.ts
import { GigRepository } from "../../infrastructure/GigRepository.js";
import { gigRepository } from "../../infrastructure/GigRepository.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class DeleteGigUseCase {
  constructor(private readonly gigRepository: GigRepository) {}

  async Execute(id: string, role: "CREATOR" | "FREELANCER"): Promise<void> {
    //confirm role of the user
    if (role !== "CREATOR") throw BusinessError.forbidden("not allowed");

    // Check if the gig exists
    const gig = await this.gigRepository.findById(id);

    if (!gig) {
      throw BusinessError.notFound("Gig not found");
    }

    // Proceed to delete
    await this.gigRepository.delete(id);
  }
}

export const deleteGigUseCase = new DeleteGigUseCase(gigRepository);
