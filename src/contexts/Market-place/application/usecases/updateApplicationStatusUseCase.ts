import { ApplicationRepository, applicationRepository } from '../../adapters/ApplicationRepository.js';
import { ApplicationStatus, ApplicationStatusType } from '../../domain/enums/DomainEnums.js';
import { ApplicationAcceptedEvent } from '../../domain/events/application.accepted.event.js';
import { ApplicationConflict, ApplicationNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';

export class UpdateApplicationUseCase {
        constructor(private readonly applicationRepository: ApplicationRepository) {}

        async execute(
                applicationId: string,
                updates: Partial<{ status: string; coverLetter: string }>,
                role: 'CREATOR' | 'FREELANCER'
        ) {
                const application = await this.applicationRepository.findById(applicationId);
                if (!application) throw new ApplicationNotFound();

                if (updates.status && role !== 'CREATOR') throw new NotAllowed();

                if (updates.coverLetter && role !== 'FREELANCER') throw new NotAllowed();

                const applicationStatus = Object.values(ApplicationStatus);

                if (!applicationStatus.includes(updates.status as ApplicationStatusType))
                        throw new ApplicationConflict('invalid status');

                if (updates.status) application.updateStatus(updates.status as ApplicationStatusType);

                if (updates.status === ApplicationStatus.ACCEPTED) {
                        const applicationAcceptedEvent = new ApplicationAcceptedEvent(
                                application.id,
                                application.freelancerId
                        );

                        //await this.eventBus.publish(applicationAcceptedEvent.eventName , applicationAcceptedEvent)
                }

                if (updates.coverLetter) application.updateCoverLetter(updates.coverLetter);

                return this.applicationRepository.save(application);
        }
}

export const updateApplicationUseCase = new UpdateApplicationUseCase(applicationRepository);

/////TODO SEPARATE THIS USECASE INTO TWO -- CREATE 2 NEW USECASES

// 1. CREATOR ACCEPT APPLICATION REQUEST (STATUS ONLY)
// 2. FREELANCER UPDATE APPLICATION STATUS (COVER LETTER ONLY)
