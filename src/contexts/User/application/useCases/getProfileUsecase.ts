import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { UserProfileNotFoundError } from '../../domain/errors/DomainErrors.js';
import { profileRepository } from '../../adapters/ProfileRepository.js';

export class GetProfileUseCase {
        constructor(private profileRepository: IProfileRepository) {}

        async execute(profileId: string) {
                const ProfileData = await this.profileRepository.findById(profileId);

                if (!ProfileData) throw new UserProfileNotFoundError();

                return ProfileData;
        }
}

export const getProfileUseCase = new GetProfileUseCase(profileRepository);
