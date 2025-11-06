import { logger } from "@core/logging/winston.js";
import { IProfileRepository } from "../../ports/IProfileRepository.js";
import { BusinessError } from "../../domain/errors/BusinessError.js";

//IMPORT IMPLEMENTATIONS
import { profileRepository } from "../../infrastructure/profileRepository.js";

export class UpdateProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async Execute(userId: string, profileId: string, updateProfileData: object) {
    console.log(userId);
    const ProfileData = await this.profileRepository.findProfileById(profileId);

    if (!ProfileData) {
      throw BusinessError.notFound("profile not found");
    }
    console.log(
      `requesterID : ${userId} , Profile.userId : ${ProfileData.userId} `
    );

    if (userId !== ProfileData.userId) {
      throw BusinessError.unauthorized("not allowed");
    }

    const updatedData = await this.profileRepository.updateUserProfile(
      profileId,
      {
        ...updateProfileData,
      }
    );

    return { message: "Profile Update Successful", ...updatedData };
  }
}

export const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
