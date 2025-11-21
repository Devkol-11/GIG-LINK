import { IEventHandler } from '@src/core/message-brokers/ports/IEventHandler.js';
import { Freelancer } from '../domain/entities/Freelancer.js';
import { IFreelancerRepository } from '../ports/IFreelancerRepository.js';

export class UserRegisteredHandler implements IEventHandler {
        constructor(private freelancerRepository: IFreelancerRepository) {}

        async handle(payload: any): Promise<void> {
                // verify sign-up is meant for freeLancers
                if (payload.role !== 'FREELANCER') return;

                // create new Freelancer entity
                const newFreelancer = Freelancer.create({
                        userId: payload.userId,
                        skills: [],
                        bio: null
                });

                // persist new entity to repository
                await this.freelancerRepository.save(newFreelancer);
        }
}
