import { BusinessError } from "@src/shared/errors/BusinessError.js";
import { ContractRepository } from "../../infrastructure/ContractRepository.js";
import { Contract } from "../../domain/entities/Contract.js";

//IMPORT IMPLEMENTATION
import { contractRepository } from "../../infrastructure/ContractRepository.js";
export class GetContractUseCase {
  constructor(private contractRepository: ContractRepository) {}

  async Execute(
    userid: string,
    role: "CREATOR" | "FREELANCER",
    contractId: string
  ) {
    let contract: Contract | null;
    switch (role) {
      case "CREATOR":
        // fetch the contract resource using its ID from the repository
        contract = await this.contractRepository.findById(contractId);

        if (!contract) throw BusinessError.notFound("contract not found");

        //confirm creator ownership of contract resource
        if (userid !== contract.creatorId)
          throw BusinessError.forbidden("not allowed");

        return contract.getState();

      case "FREELANCER":
        //fetch the contract resource using its ID
        contract = await this.contractRepository.findById(contractId);

        if (!contract) throw BusinessError.notFound("contract not found");

        // confirm freelancer ownership of contract resource
        if (userid !== contract.freelancerId)
          throw BusinessError.forbidden("not allowed");

        return contract.getState();
    }
  }
}

export const getContractUseCase = new GetContractUseCase(contractRepository);
