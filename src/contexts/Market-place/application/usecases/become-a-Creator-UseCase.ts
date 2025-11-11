import { IFreelancerRepository } from "../../ports/IFreelancerRepository.js";
import { Freelancer } from "../../domain/entities/Freelancer.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class Become_A_Creator_UseCase {
  constructor(private freeLancerRepository: IFreelancerRepository) {}

  async Execute(freeLancerId: string, role: "CREATOR" | "FREELANCER") {
    let freeLancer: Freelancer | null;
    // confirm user is not a creator
    if (role === "CREATOR") throw BusinessError.badRequest("already a creator");

    //confirm freeLancerID is valid
    freeLancer = await this.freeLancerRepository.findByUserId(freeLancerId);
    if (!freeLancer) throw BusinessError.notFound("invalid");
  }
}
