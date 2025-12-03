import { GigNotFound } from '../../domain/errors/DomainErrors.js';
import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';

export class GetGigUseCase {
        constructor(private gigRepository: GigRepository) {}

        async Execute(gigId: string) {
                const gig = await this.gigRepository.findById(gigId);

                if (!gig) throw new GigNotFound();

                return gig.getState();
        }
}

export const getGigUseCase = new GetGigUseCase(gigRepository);
