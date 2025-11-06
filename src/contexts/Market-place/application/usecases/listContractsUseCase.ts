import { BusinessError } from "@src/shared/errors/BusinessError.js";
import { ContractRepository } from "../../infrastructure/ContractRepository.js";

//IMPORT IMPLEMENTATIONS
import { contractRepository } from "../../infrastructure/ContractRepository.js";

export class ListContractsUseCase {
  constructor(private contractRepository: ContractRepository) {}

  async Execute(userId: string, role: "CREATOR" | "FREELANCER") {
    let contracts;
    switch (role) {
      case "CREATOR":
        contracts = await this.contractRepository.findByCreatorId(userId);
        break;

      case "FREELANCER":
        contracts = await this.contractRepository.findByFreeLancerId(userId);
        break;
    }
    if (!contracts?.length) {
      throw BusinessError.notFound(
        "You do not have any active contracts at the moment"
      );
    }

    return contracts.map((contract) => contract.getState());
  }
}

export const listContractsUseCase = new ListContractsUseCase(
  contractRepository
);
