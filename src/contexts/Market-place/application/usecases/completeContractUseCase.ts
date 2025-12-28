import { ContractRepository } from '../../adapters/ContractRepository.js';
import { Contract } from '../../domain/entities/Contract.js';
import { ContractNotFound, NotAllowed } from '../../domain/errors/DomainErrors.js';

export class CompleteContractUseCase {
        constructor(private contractrepository: ContractRepository) {}

        async execute(creatorId: string, contractId: string) {
                const contract = await this.contractrepository.findById(contractId);

                if (!contract) throw new ContractNotFound();

                if (creatorId !== contract.creatorId)
                        throw new NotAllowed('not allowed to access this contract info');

                contract.markAsCompleted();
                contract.updateEndDate();

                await this.contractrepository.save(contract);

                //emit contract complete event
                //await this.eventBus.publish(new ContractCompletedEvent(contract.id))

                return { message: 'Contract completion successful' };
        }
}
