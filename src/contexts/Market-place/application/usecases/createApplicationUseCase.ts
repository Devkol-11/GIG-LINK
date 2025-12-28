import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';
import { FreelancerRepository, freelancerRepository } from '../../adapters/FreelancerRepository.js';
import { ApplicationRepository, applicationRepository } from '../../adapters/ApplicationRepository.js';
import { Application } from '../../domain/entities/Application.js';
import { createApplicationDTO } from '../dtos/createApplicationDTO.js';
import {
        GigConflict,
        GigNotActive,
        GigNotFound,
        NotAllowed,
        NotFound
} from '../../domain/errors/DomainErrors.js';

export class CreateApplicationUseCase {
        constructor(
                private readonly gigRepository: GigRepository,
                private readonly applicationRepository: ApplicationRepository,
                private readonly freelancerRepository: FreelancerRepository
        ) {}

        async execute(data: createApplicationDTO) {
                const { gigId, freelancerId, coverLetter } = data;

                const freeLancer = await this.freelancerRepository.findById(freelancerId);

                if (!freeLancer) {
                        throw new NotFound('FreeLancer not found');
                }

                freeLancer.canApplyForGig();

                const gig = await this.gigRepository.findById(gigId);

                if (!gig) throw new GigNotFound();

                const existingGig = await this.applicationRepository.findByGigAndFreelancer(
                        gigId,
                        freelancerId
                );
                if (existingGig) throw new GigConflict();

                gig.checkStatus();

                const newApplication = Application.create({
                        gigId,
                        freelancerId,
                        coverLetter,
                        creatorId: gig.creatorId
                });

                await this.applicationRepository.save(newApplication);
                return { message: 'Application sent successfully' };
        }
}

export const createApplicationUseCase = new CreateApplicationUseCase(
        gigRepository,
        applicationRepository,
        freelancerRepository
);
