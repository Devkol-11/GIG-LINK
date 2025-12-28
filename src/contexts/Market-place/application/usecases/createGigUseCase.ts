import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';
import { Gig } from '../../domain/entities/Gig.js';
import { createGigDTO } from '../dtos/createGigDTO.js';

export class CreateGigUseCase {
        constructor(private gigRepository: GigRepository) {}
        async execute(data: createGigDTO) {
                const { title, description, price, category, creatorId, tags, deadline } = data;

                const newGig = Gig.create({
                        title,
                        description,
                        price,
                        category,
                        tags,
                        deadline,
                        creatorId
                });

                await this.gigRepository.save(newGig);

                return { message: 'gig created successfully', gig: newGig };
        }
}

export const createGigUseCase = new CreateGigUseCase(gigRepository);
