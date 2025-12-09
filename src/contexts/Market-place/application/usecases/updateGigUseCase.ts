import { GigNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';
import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';

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

                if (!gig) throw new GigNotFound();

                if (gig.creatorId !== userId) throw new NotAllowed();

                const updatedGig = await this.gigRepository.update(
                        gigId,
                        updates
                );

                return updatedGig.getState();
        }
}

export const updateGigUseCase = new UpdateGigUseCase(gigRepository);
