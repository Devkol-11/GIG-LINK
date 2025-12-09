import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { profileRepository } from '../../adapters/profileRepository.js';

export class GetProfileUseCase {
        constructor(private profileRepository: IProfileRepository) {}

        async Execute(profileId: string) {
                const ProfileData =
                        await this.profileRepository.findProfileById(profileId);

                console.log(ProfileData);

                if (!ProfileData) {
                        throw BusinessError.notFound('Profile not found');
                }

                return ProfileData;
        }
}

export const getProfileUseCase = new GetProfileUseCase(profileRepository);
