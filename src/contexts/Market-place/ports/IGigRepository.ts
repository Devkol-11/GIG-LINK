import { Gig } from '../domain/entities/Gig.js';

export interface IGigRepository {
        save(gig: Gig): Promise<Gig>;
        findById(id: string): Promise<Gig | null>;
        findByCreatorId(
                creatorId: string,
                options?: { skip?: number; take?: number }
        ): Promise<{ gigs: Gig[]; total: number }>;
        findAll(options?: { skip?: number; take?: number }): Promise<{
                gigs: Gig[];
                totalValue: number;
        }>;

        update(
                id: string,
                updates: Partial<{
                        title: string;
                        description: string;
                        price: number;
                        category: string;
                        tags: string[];
                        deadline: Date;
                }>
        ): Promise<Gig>;
        delete(id: string): Promise<void>;
}
