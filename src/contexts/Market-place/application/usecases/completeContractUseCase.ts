import { ContractRepository } from '../../adapters/ContractRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import {
        ContractNotFound,
        NotAllowed
} from '../../domain/errors/DomainErrors.js';

export class CompleteContractUseCase {
        constructor(private contractrepository: ContractRepository) {}

        async Execute(creatorId: string, contractId: string) {
                let contract: Contract | null;
                contract = await this.contractrepository.findById(contractId);

                if (contract === null) throw new ContractNotFound();

                if (creatorId !== contract.creatorId)
                        throw new NotAllowed(
                                'not allowed to access this contract info'
                        );

                contract.markAsCompleted();

                //emit contract complete event
                //await this.eventBus.publish(new ContractCompletedEvent(contract.id))

                return contract.getState();
        }
}
