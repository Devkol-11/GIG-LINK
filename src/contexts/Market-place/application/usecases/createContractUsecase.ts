import { contractRepository } from '../../adapters/ContractRepository.js';
import { IContractRepository } from '../../ports/IContractRepository.js';
import { IGigRepository } from '../../ports/IGigRepository.js';
import { IApplicationRepository } from '../../ports/IApplicationRepository.js';
import { applicationRepository } from '../../adapters/ApplicationRepository.js';
import { gigRepository } from '../../adapters/GigRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import {
        ApplicationConflict,
        ApplicationNotFound,
        GigNotFound,
        NotAllowed
} from '../../domain/errors/DomainErrors.js';
import { IEventBus } from '../../ports/IEventBus.js';
import { domainEventBus } from '../../adapters/Domain-EventBus.js';
import { ContractCreatedEvent } from '../../domain/events/contract.created.event.js';

export class CreateContractUseCase {
        constructor(
                private readonly contractRepository: IContractRepository,
                private readonly applicationRepository: IApplicationRepository,
                private readonly gigRepository: IGigRepository,
                private readonly domainEventBus: IEventBus
        ) {}

        async execute(applicationId: string, creatorId: string) {
                const application = await this.applicationRepository.findById(applicationId);
                if (!application) throw new ApplicationNotFound();

                const gig = await this.gigRepository.findById(application.gigId);

                if (!gig) throw new GigNotFound();

                if (gig.creatorId !== creatorId) throw new NotAllowed();

                if (application.status !== 'ACCEPTED')
                        throw new ApplicationConflict('Application request must be accepted ');

                const contract = Contract.create({
                        gigId: gig.id,
                        applicationId: application.id,
                        creatorId: gig.creatorId,
                        freelancerId: application.freelancerId,
                        amountKobo: gig.price,
                        currency: 'NGN',
                        startDate: new Date(),
                        endDate: null
                });

                await this.contractRepository.save(contract);

                const contractCreatedEvent = new ContractCreatedEvent(
                        application.id,
                        application.creatorId,
                        application.freelancerId,
                        contract.amount
                );

                await this.domainEventBus.publish('contract:created', contractCreatedEvent.getPayload());
                return { message: 'contract created' };
        }
}

export const createContractUseCase = new CreateContractUseCase(
        contractRepository,
        applicationRepository,
        gigRepository,
        domainEventBus
);
