import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { profileRepository } from '../../adapters/ProfileRepository.js';
import { UserProfileNotFoundError } from '../../domain/errors/DomainErrors.js';
import { UnAuthorizedAccessError } from '../../domain/errors/DomainErrors.js';

export class UpdateAvatarUseCase {
        constructor(private profileRepository: IProfileRepository) {}

        async execute(userId: string, newAvatarUrl: string) {
                const profile = await this.profileRepository.findById(userId);

                if (!profile) {
                        throw new UserProfileNotFoundError();
                }

                if (userId !== profile.userId) {
                        throw new UnAuthorizedAccessError();
                }

                profile.updateAvatar(newAvatarUrl);
                await this.profileRepository.save(profile);
        }
}

export const updateAvatarUseCase = new UpdateAvatarUseCase(profileRepository);
