import { IProfileRepository } from '../../ports/IProfileRepository.js';
import { BusinessError } from '../../domain/errors/BusinessError.js';
import { profileRepository } from '../../adapters/profileRepository.js';

export class UpdateAvatarUseCase {
        constructor(private profileRepository: IProfileRepository) {}

        async Execute(userId: string, newAvatarUrl: string) {
                const ProfileData =
                        await this.profileRepository.findProfileById(userId);

                if (!ProfileData) {
                        throw BusinessError.notFound('profile not found');
                }

                if (userId !== ProfileData.userId) {
                        throw BusinessError.unauthorized('not allowed');
                }

                const updatedData =
                        await this.profileRepository.updateUserProfile(userId, {
                                avatarUrl: newAvatarUrl
                        });

                return updatedData;
        }
}

export const updateAvatarUseCase = new UpdateAvatarUseCase(profileRepository);
