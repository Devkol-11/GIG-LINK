import { GigRepository } from "../../infrastructure/GigRepository.js";
import { Gig } from "../../domain/entities/Gig.js";
import { createGigDTO } from "../dtos/createGigDTO.js";

//IMPORT IMPLEMENTATIONS
import { gigRepository } from "../../infrastructure/GigRepository.js";

export class CreateGigUseCase {
  constructor(private gigRepository: GigRepository) {}
  async Execute(data: createGigDTO) {
    const { title, description, price, category, creatorId, tags, deadline } =
      data;
      // Create a new Gig Entity
    const newGig = Gig.create({
      title,
      description,
      price,
      category,
      tags,
      deadline,
      creatorId,
    });

    // Persist to the Database
    const savedGig = await this.gigRepository.save(newGig);
    return savedGig.getState();
  }
}

export const createGigUseCase = new CreateGigUseCase(gigRepository);
