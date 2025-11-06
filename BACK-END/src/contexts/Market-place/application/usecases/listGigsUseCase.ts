import { GigRepository } from "../../infrastructure/GigRepository.js";

// IMPORT IMPLEMENTATIONS
import { gigRepository } from "../../infrastructure/GigRepository.js";

export class ListGigsUseCase {
  constructor(private gigRepository: GigRepository) {}

  async Execute() {
    const { gigs } = await this.gigRepository.findAll();
    return gigs.map((gig) => gig.getState());
  }
}

export const listGigsUseCase = new ListGigsUseCase(gigRepository);
