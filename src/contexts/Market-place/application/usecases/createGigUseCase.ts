import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';
import { Gig } from '../../domain/entities/Gig.js';
import { createGigDTO } from '../dtos/createGigDTO.js';

export class CreateGigUseCase {
        constructor(private gigRepository: GigRepository) {}
        async Execute(data: createGigDTO) {
                const {
                        title,
                        description,
                        price,
                        category,
                        creatorId,
                        tags,
                        deadline
                } = data;

                const newGig = Gig.create({
                        title,
                        description,
                        price,
                        category,
                        tags,
                        deadline,
                        creatorId
                });

                const savedGig = await this.gigRepository.save(newGig);

                return savedGig.getState();
        }
}

export const createGigUseCase = new CreateGigUseCase(gigRepository);
