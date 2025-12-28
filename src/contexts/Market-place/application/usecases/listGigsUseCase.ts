import { GigNotFound } from '../../domain/errors/DomainErrors.js';
import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';

export class ListGigsUseCase {
        constructor(private gigRepository: GigRepository) {}

        async execute() {
                const { gigs } = await this.gigRepository.findAll();

                if (!gigs) throw new GigNotFound();

                return gigs.map((gig) => gig.getState());
        }
}

export const listGigsUseCase = new ListGigsUseCase(gigRepository);
