import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { UserProfile } from '../../domain/entities/UserProfile.js';
import { UserService } from '../../domain/services/UserService.js';
import { createProfileData } from '../dtos/createProfileDTO.js';
import { UserProfileNotFoundError } from '../../domain/errors/DomainErrors.js';
import { profileRepository } from '../../adapters/ProfileRepository.js';
import { userService } from '../../domain/services/UserService.js';

export class CreateProfileUseCase {
        constructor(
                private profileRepository: IProfileRepository,
                private userService: UserService
        ) {}

        async execute(userId: string, profile: createProfileData) {
                const { bio, skills, interests, location } = profile;
                const userProfileData = await this.profileRepository.findUserById(userId);

                if (!userProfileData) throw new UserProfileNotFoundError();

                const avatar = this.userService.createAvatar();

                const userProfile = UserProfile.Create({
                        bio,
                        userId: userProfileData.userId,
                        skills,
                        interests,
                        location,
                        avatarUrl: avatar
                });

                await this.profileRepository.save(userProfile);

                return { message: 'profile created successfully' };
        }
}

export const createProfileUseCase = new CreateProfileUseCase(profileRepository, userService);
