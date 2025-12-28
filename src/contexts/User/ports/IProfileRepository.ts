import { UserProfile } from '../domain/entities/UserProfile.js';

export interface IProfileRepository {
        findUserById(userId: string): Promise<UserProfile | null>;
        findById(profileId: string): Promise<UserProfile | null>;
        save(data: Partial<UserProfile>): Promise<UserProfile | null>;
}
