import { GigNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';
import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';

export class DeleteGigUseCase {
        constructor(private readonly gigRepository: GigRepository) {}

        async execute(gigId: string, creatorId: string): Promise<object> {
                const gig = await this.gigRepository.findById(gigId);

                if (!gig) throw new GigNotFound();

                if (gig.creatorId !== creatorId) throw new NotAllowed();

                await this.gigRepository.delete(gigId);

                return { message: 'gig deleted successfully' };
        }
}

export const deleteGigUseCase = new DeleteGigUseCase(gigRepository);
