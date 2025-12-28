import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { IProfileRepository } from '../ports/IProfileRepository.js';
import { UserProfile } from '../domain/entities/UserProfile.js';

export class ProfileRepository implements IProfileRepository {
        async findUserById(userId: string): Promise<UserProfile | null> {
                const record = await prismaDbClient.userProfile.findUnique({
                        where: {
                                userId: userId
                        }
                });

                if (!record) return null;
                return UserProfile.toEntity(record);
        }

        async findById(profileId: string): Promise<UserProfile | null> {
                const record = await prismaDbClient.userProfile.findUnique({
                        where: {
                                id: profileId
                        }
                });
                if (!record) return null;
                return UserProfile.toEntity(record);
        }

        async save(data: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile | null> {
                const state = data.getState();
                const record = await prismaDbClient.userProfile.upsert({
                        where: { userId: state.userId },
                        update: state,
                        create: state
                });

                if (!record) return null;
                return UserProfile.toEntity(record);
        }
}

export const profileRepository = new ProfileRepository();
