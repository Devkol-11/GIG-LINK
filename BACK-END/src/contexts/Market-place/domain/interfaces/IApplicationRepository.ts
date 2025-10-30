import { Application } from "../entities/Application.js";

export interface IApplicationRepository {
  save(application: Application): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findByGigId(gigId: string): Promise<Application[]>;
  findByFreelancerId(freelancerId: string): Promise<Application[]>;
  findAll(): Promise<Application[]>;
  delete(id: string): Promise<void>;
}
