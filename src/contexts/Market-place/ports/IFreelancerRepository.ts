import { Freelancer } from '../domain/entities/Freelancer.js';

export interface IFreelancerRepository {
        save(freelancer: Freelancer): Promise<Freelancer>;
        findById(id: string): Promise<Freelancer | null>;
        findByUserId(userId: string): Promise<Freelancer | null>;
        findAll(options?: { skip?: number; take?: number }): Promise<{
                freelancers: Freelancer[];
                total: number;
        }>;
}
