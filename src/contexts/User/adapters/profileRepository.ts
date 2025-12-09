import { prismaDbClient } from '@core/database/prisma.client.js';
import { IProfileRepository } from '../ports/IProfileRepository.js';
import { UserProfile } from 'prisma/generated/prisma/client.js';

export class ProfileRepository implements IProfileRepository {
        async findUserById(userId: string): Promise<UserProfile | null> {
                const record = await prismaDbClient.userProfile.findUnique({
                        where: {
                                userId: userId
                        }
                });
                return record;
        }

        async findProfileById(profileId: string): Promise<UserProfile | null> {
                const record = await prismaDbClient.userProfile.findUnique({
                        where: {
                                id: profileId
                        }
                });
                return record;
        }

        async createUserProfile(
                data: Omit<UserProfile, 'createdAt' | 'updatedAt'>
        ): Promise<UserProfile | null> {
                const record = await prismaDbClient.userProfile.create({
                        data
                });
                return record;
        }

        async updateUserProfile(
                profileId: string,
                updateData: Partial<UserProfile>
        ): Promise<UserProfile | null> {
                const record = await prismaDbClient.userProfile.update({
                        where: { id: profileId },
                        data: updateData
                });
                return record;
        }
}

export const profileRepository = new ProfileRepository();
