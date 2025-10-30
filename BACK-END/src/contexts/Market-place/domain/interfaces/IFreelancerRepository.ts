import { Freelancer } from "../entities/Freelancer.js";

export interface IFreelancerRepository {
  save(freelancer: Freelancer): Promise<Freelancer>;
  findById(id: string): Promise<Freelancer | null>;
  findByUserId(userId: string): Promise<Freelancer | null>;
  findAll(): Promise<Freelancer[]>;
  delete(id: string): Promise<void>;
}
