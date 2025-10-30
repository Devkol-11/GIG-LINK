import { createGigDTO } from "../dtos/createGigDTO.js";
import { GigRepository } from "../../infrastructure/GigRepository.js";
import { gigRepository } from "../../infrastructure/GigRepository.js";
import { Gig } from "../../domain/entities/Gig.js";

export class CreateGigUseCase {
  constructor(gigRepository: GigRepository) {}

  async Execute(data: createGigDTO) {}
}

export const createGigUseCase = new CreateGigUseCase();
