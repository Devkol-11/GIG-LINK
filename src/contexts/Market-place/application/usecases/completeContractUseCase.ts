import { ContractRepository } from "../../infrastructure/ContractRepository.js";
import { Contract } from "../../domain/entities/Contract.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class CompleteContractUseCase {
  constructor(private contractrepository: ContractRepository) {}

  async Execute(creatorId: string, contractId: string) {
    // fetch the contract from the repository
    let contract: Contract | null;
    contract = await this.contractrepository.findById(contractId);

    // confirm creator ownwership of contract resource
    if (creatorId !== contract?.creatorId)
      throw BusinessError.forbidden("not allowed");

    //mark the contract as complete
    contract.markAsCompleted();

    //emit contract complete event
    //await this.eventBus.publish(new ContractCompletedEvent(contract.id))

    return contract.getState();
  }
}
