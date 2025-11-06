import { Contract } from "../domain/entities/Contract.js";

export interface IContractRepository {
  save(contract: Contract): Promise<Contract>;
  findById(id: string): Promise<Contract | null>;
  findByGigId(gigId: string): Promise<Contract | null>;
  findByCreatorId(
    creatorId: string,
    options?: { skip?: number; take?: number }
  ): Promise<Contract[] | null>;
  findByFreeLancerId(
    feeelancerId: string,
    options?: { skip?: number; take?: number }
  ): Promise<Contract[] | null>;
  findByApplicationId(applicationId: string): Promise<Contract | null>;
  findAll(options?: { skip?: number; take?: number }): Promise<{
    contracts: Contract[];
    total: number;
  }>;
  delete(id: string): Promise<void>;
}
