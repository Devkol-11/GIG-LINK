import { ContractRepository, contractRepository } from '../../adapters/ContractRepository.js';
import { ContractNotFound } from '../../domain/errors/DomainErrors.js';

export class ListContractsUseCase {
        constructor(private contractRepository: ContractRepository) {}

        async execute(userId: string, role: 'CREATOR' | 'FREELANCER') {
                let contracts;
                switch (role) {
                        case 'CREATOR':
                                contracts = await this.contractRepository.findByCreatorId(userId);
                                break;

                        case 'FREELANCER':
                                contracts = await this.contractRepository.findByFreeLancerId(userId);
                                break;
                }
                if (!contracts?.length) {
                        throw new ContractNotFound('You do not have any contracts at the moment');
                }

                return contracts.map((contract) => contract.getState());
        }
}

export const listContractsUseCase = new ListContractsUseCase(contractRepository);
