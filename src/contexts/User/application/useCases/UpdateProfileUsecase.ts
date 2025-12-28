import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { UnAuthorizedAccessError, UserProfileNotFoundError } from '../../domain/errors/DomainErrors.js';
import { profileRepository } from '../../adapters/ProfileRepository.js';

export interface updateProfileData {
        bio: string;
        skills: string[];
        interests: string[];
        location: string;
}
export class UpdateProfileUseCase {
        constructor(private profileRepository: IProfileRepository) {}

        async execute(userId: string, profileId: string, updates: updateProfileData) {
                const profile = await this.profileRepository.findById(profileId);

                if (!profile) {
                        throw new UserProfileNotFoundError();
                }

                if (userId !== profile.userId) {
                        throw new UnAuthorizedAccessError();
                }

                profile.updateBio(updates.bio);
                profile.updateSkills(updates.skills);
                profile.updateInterests(updates.interests);
                profile.updateLocation(updates.location);

                await this.profileRepository.save(profile);

                return {
                        message: 'Profile Update Successful'
                };
        }
}

export const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
