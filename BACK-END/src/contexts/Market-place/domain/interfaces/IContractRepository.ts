import { Contract } from "../entities/Contract.js";

export interface IContractRepository {
  save(contract: Contract): Promise<Contract>;
  findById(id: string): Promise<Contract | null>;
  findByGigId(gigId: string): Promise<Contract | null>;
  findByApplicationId(applicationId: string): Promise<Contract | null>;
  findAll(): Promise<Contract[]>;
  delete(id: string): Promise<void>;
}
