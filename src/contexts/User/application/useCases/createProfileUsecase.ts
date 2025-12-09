import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { UserService } from '../../services/userService.js';
import { createProfileData } from '../dtos/createProfileDTO.js';
import { profileRepository } from '../../adapters/profileRepository.js';
import { userService } from '../../services/userService.js';

export class CreateProfileUseCase {
        constructor(
                private profileRepository: IProfileRepository,
                private userService: UserService
        ) {}

        async Execute(userId: string, profile: createProfileData) {
                const userProfileData =
                        await this.profileRepository.findUserById(userId);

                if (userProfileData) {
                        throw BusinessError.notFound(
                                'profile already exists for this user'
                        );
                }

                const avatarUrl = this.userService.createAvatar();

                const createdData =
                        await this.profileRepository.createUserProfile({
                                ...profile,
                                userId,
                                avatarUrl
                        });

                return createdData;
        }
}

export const createProfileUseCase = new CreateProfileUseCase(
        profileRepository,
        userService
);
