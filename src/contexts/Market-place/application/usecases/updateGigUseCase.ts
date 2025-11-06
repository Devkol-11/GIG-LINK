import { GigRepository } from "../../infrastructure/GigRepository.js";
import { gigRepository } from "../../infrastructure/GigRepository.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class UpdateGigUseCase {
  constructor(private readonly gigRepository: GigRepository) {}

  async Execute(
    gigId: string,
    updates: Partial<{
      title: string;
      description: string;
      price: number;
      category: string;
      tags: string[];
      deadline: Date;
    }>,
    userId: string
  ) {
    const gig = await this.gigRepository.findById(gigId);
    if (!gig) throw BusinessError.notFound("Gig not found");

    // Only a valid creator can update the gig
    if (gig.creatorId !== userId)
      throw BusinessError.unauthorized("Not allowed to update this gig");

    const updatedGig = await this.gigRepository.update(gigId, updates);
    return updatedGig.getState();
  }
}

export const updateGigUseCase = new UpdateGigUseCase(gigRepository);
