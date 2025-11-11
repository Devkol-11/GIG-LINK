import { freelancerRepository } from "../infrastructure/FreelancerRepository.js";
import { UserRegisteredHandler } from "./UserRegisteredHandler.js";

export const marketplaceHandlers = {
  "user.registered": new UserRegisteredHandler(freelancerRepository),
  // add more events -> handlers here
};

marketplaceHandlers["user.registered"];
