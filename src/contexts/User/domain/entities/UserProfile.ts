import { randomUUID } from 'crypto';

export interface UserProfileProps {
        readonly id: string;
        readonly userId: string;
        bio: string | null;
        skills: string[];
        avatarUrl: string | null;
        interests: string[];
        location: string;
        createdAt: Date;
        updatedAt: Date;
}

export class UserProfile {
        private constructor(private props: UserProfileProps) {}

        public static Create(props: Omit<UserProfileProps, 'id' | 'createdAt' | 'updatedAt'>) {
                return new UserProfile({
                        id: randomUUID(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        public static toEntity(props: UserProfileProps) {
                return new UserProfile(props);
        }

        getState() {
                return this.props;
        }

        updateAvatar(avatarUrl: string) {
                this.props.avatarUrl = avatarUrl;
                this.props.updatedAt = new Date();
        }

        updateBio(bio: string) {
                this.props.bio = bio;
                this.props.updatedAt = new Date();
        }

        updateSkills(skills: string[]) {
                this.props.skills = skills;
                this.props.updatedAt = new Date();
        }

        updateLocation(location: string) {
                this.props.location = location;
                this.props.updatedAt = new Date();
        }

        updateInterests(interests: string[]) {
                this.props.interests = interests;
                this.props.updatedAt = new Date();
        }

        get id() {
                return this.props.id;
        }

        get userId() {
                return this.props.userId;
        }
}
