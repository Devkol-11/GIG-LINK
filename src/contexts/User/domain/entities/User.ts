import { randomUUID } from 'crypto';
import { UserRoleType } from '../enums/DomainEnums.js';

export interface UserProps {
        readonly id: string;
        email: string;
        firstName: string;
        lastName: string;
        googleId: string | null;
        phoneNumber: string | null
        passwordHash: string | null
        isEmailVerified: boolean;
        isSuspended: boolean;
        role: UserRoleType;
        createdAt: Date;
        updatedAt: Date;
}

export class User {
        private constructor(private props: UserProps) {}

        public static Create(
                props: Omit<
                        UserProps,
                        'id' | 'isEmailVerified' | 'isSuspended' | 'createdAt' | 'updatedAt'
                >
        ): User {
                return new User({
                        id: randomUUID(),
                        isEmailVerified: false,
                        isSuspended: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        public static toEntity(props: UserProps) {
                return new User(props);
        }

        getState() {
                return this.props;
        }

        changePassword(newPasswordHash: string) {
                this.props.passwordHash = newPasswordHash;
                this.props.updatedAt = new Date();
        }

        get id() {
                return this.props.id;
        }

        get email() {
                return this.props.email;
        }

        get firstName() {
                return this.props.firstName;
        }

        get phoneNumber() {
                return this.props.phoneNumber;
        }

        get passwordHash() {
                return this.props.passwordHash;
        }

        get role() {
                return this.props.role;
        }

        get lastName() {
                return this.props.lastName;
        }

        get isEmailVerified() {
                return this.props.isEmailVerified;
        }
}
