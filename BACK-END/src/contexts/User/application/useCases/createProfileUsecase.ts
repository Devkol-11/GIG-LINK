import { IProfileRepository } from "../../domain/interfaces/IProfileRepository.js";
import { BusinessError } from "../../domain/errors/DomainError.js";
import { UserService } from "../../domain/services/userService.js";
import { createProfileData } from "../dtos/createProfileDTO.js";

//IMPORT IMPLEMENTATIONS
import { profileRepository } from "../../infrastructure/profileRepository.js";
import { userService } from "../../domain/services/userService.js";

export class CreateProfileUseCase {
  constructor(
    private profileRepository: IProfileRepository,
    private userService: UserService
  ) {}

  async Execute(userId: string, profile: createProfileData) {
    const userProfileData = await this.profileRepository.findUserById(userId);

    if (userProfileData) {
      throw BusinessError.notFound("profile already exists for this user");
    }

    const avatarUrl = this.userService.createAvtar();

    const createdData = await this.profileRepository.createUserProfile({
      ...profile,
      userId,
      avatarUrl,
    });

    return createdData;
  }
}

export const createProfileUseCase = new CreateProfileUseCase(
  profileRepository,
  userService
);
