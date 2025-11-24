import {
        GigRepository,
        gigRepository
} from '../../infrastructure/GigRepository.js';
import {
        FreelancerRepository,
        freelancerRepository
} from '../../infrastructure/FreelancerRepository.js';
import {
        ApplicationRepository,
        applicationRepository
} from '../../infrastructure/ApplicationRepository.js';
import { Application } from '../../domain/entities/Application.js';
import { createApplicationDTO } from '../dtos/createApplicationDTO.js';
import {
        GigConflict,
        GigNotActive,
        GigNotFound
} from '../../domain/errors/DomainErrors.js';

export class CreateApplicationUseCase {
        constructor(
                private readonly gigRepository: GigRepository,
                private readonly applicationRepository: ApplicationRepository,
                private readonly freelancerRepository: FreelancerRepository
        ) {}

        async Execute(data: createApplicationDTO) {
                const { gigId, freelancerId, coverLetter } = data;

                const gig = await this.gigRepository.findById(gigId);

                if (!gig) throw new GigNotFound();

                const existing =
                        await this.applicationRepository.findByGigAndFreelancer(
                                gigId,
                                freelancerId
                        );
                if (existing) throw new GigConflict();

                if (gig.status === 'ACTIVE') throw new GigNotActive();

                const freeLancer =
                        await this.freelancerRepository.findById(freelancerId);
                freeLancer?.canApplyForGig();

                const newApplication = Application.create({
                        gigId,
                        freelancerId,
                        coverLetter
                });

                const savedApplication =
                        await this.applicationRepository.save(newApplication);
                return savedApplication.getState();
        }
}

export const createApplicationUseCase = new CreateApplicationUseCase(
        gigRepository,
        applicationRepository,
        freelancerRepository
);
