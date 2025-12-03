import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { profileRepository } from '../../adapters/profileRepository.js';

export class UpdateProfileUseCase {
        constructor(private profileRepository: IProfileRepository) {}

        async Execute(
                userId: string,
                profileId: string,
                updateProfileData: object
        ) {
                console.log(userId);
                const ProfileData =
                        await this.profileRepository.findProfileById(profileId);

                if (!ProfileData) {
                        throw BusinessError.notFound('profile not found');
                }

                if (userId !== ProfileData.userId) {
                        throw BusinessError.unauthorized('not allowed');
                }

                await this.profileRepository.updateUserProfile(profileId, {
                        ...updateProfileData
                });

                return {
                        message: 'Profile Update Successful'
                };
        }
}

export const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
