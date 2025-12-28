import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { ContractRepository, contractRepository } from '../../adapters/ContractRepository.js';
import { Contract } from '../../domain/entities/Contract.js';

export class GetContractUseCase {
        constructor(private contractRepository: ContractRepository) {}

        async execute(userid: string, role: 'CREATOR' | 'FREELANCER', contractId: string) {
                let contract: Contract | null;
                switch (role) {
                        case 'CREATOR':
                                contract = await this.contractRepository.findById(contractId);

                                if (!contract) throw BusinessError.notFound('contract not found');

                                if (userid !== contract.creatorId)
                                        throw BusinessError.forbidden('not allowed');

                                return contract.getState();

                        case 'FREELANCER':
                                contract = await this.contractRepository.findById(contractId);

                                if (!contract) throw BusinessError.notFound('contract not found');

                                if (userid !== contract.freelancerId)
                                        throw BusinessError.forbidden('not allowed');

                                return contract.getState();
                }
        }
}

export const getContractUseCase = new GetContractUseCase(contractRepository);
