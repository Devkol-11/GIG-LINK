import { Application } from "../domain/entities/Application.js";

export interface IApplicationRepository {
  save(application: Application): Promise<Application>;

  findById(id: string): Promise<Application | null>;

  findByGigId(
    gigId: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ applications: Application[]; total: number }>;

  findByFreelancerId(
    freelancerId: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ applications: Application[]; total: number }>;

  findByGigIds(
    gigIds: string[],
    options?: { skip?: number; take?: number }
  ): Promise<{ applications: Application[]; total: number }>;

  findByGigAndFreelancer(
    gigId: string,
    freelancerId: string
  ): Promise<Application | null>;

  findAll(options?: { skip?: number; take?: number }): Promise<{
    applications: Application[];
    total: number;
  }>;
  delete(id: string): Promise<void>;

  update(application: Application): Promise<Application>;
}
