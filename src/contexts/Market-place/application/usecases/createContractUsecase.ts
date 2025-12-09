import {
        ContractRepository,
        contractRepository
} from '../../adapters/ContractRepository.js';
import {
        ApplicationRepository,
        applicationRepository
} from '../../adapters/ApplicationRepository.js';
import { GigRepository, gigRepository } from '../../adapters/GigRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import {
        ApplicationConflict,
        ApplicationNotFound,
        GigNotFound,
        NotAllowed
} from '../../domain/errors/DomainErrors.js';

export class CreateContractUseCase {
        constructor(
                private readonly contractRepository: ContractRepository,
                private readonly applicationRepository: ApplicationRepository,
                private readonly gigRepository: GigRepository
        ) {}

        async Execute(applicationId: string, creatorId: string) {
                const application =
                        await this.applicationRepository.findById(
                                applicationId
                        );
                if (!application) throw new ApplicationNotFound();

                const gig = await this.gigRepository.findById(
                        application.gigId
                );

                if (!gig) throw new GigNotFound();

                if (gig.creatorId !== creatorId) throw new NotAllowed();

                if (application.status !== 'ACCEPTED')
                        throw new ApplicationConflict(
                                'Application request must be accepted '
                        );

                const contract = Contract.create({
                        gigId: gig.id,
                        applicationId: application.id,
                        creatorId: creatorId,
                        freelancerId: application.freelancerId,
                        startDate: new Date(),
                        endDate: null
                });

                const savedContract =
                        await this.contractRepository.save(contract);
                return savedContract.getState();
        }
}

export const createContractUseCase = new CreateContractUseCase(
        contractRepository,
        applicationRepository,
        gigRepository
);
