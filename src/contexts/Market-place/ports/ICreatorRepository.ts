import { Creator } from '../domain/entities/Creator.js';

export interface ICreatorRepository {
        save(creator: Creator): Promise<Creator>;
        findById(id: string): Promise<Creator | null>;
        findByUserId(userId: string): Promise<Creator | null>;
        findAll(options?: {
                skip?: number;
                take?: number;
        }): Promise<{ creators: Creator[]; total: number }>;

        delete(id: string): Promise<void>;
}
