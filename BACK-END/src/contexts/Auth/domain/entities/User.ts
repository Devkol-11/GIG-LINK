import { DomainException } from "../errors/DomainErrors";
import { createId } from "@paralleldrive/cuid2";

export interface UserProps {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(
    props: Omit<UserProps, "id" | "isEmailVerified" | "createdAt" | "updatedAt">
  ): User {
    const now = new Date();
    return new User({
      ...props,
      id: createId(),
      isEmailVerified: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static rehydrate(props: UserProps) {
    if (!props.id) {
      throw new DomainException("invalid userId", 404);
    }
    return new User(props);
  }

  // getters - return only
  get id(): string {
    return this.props.id;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string {
    return this, this.props.password;
  }
  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string {
    return this.props.lastName;
  }
  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }
  get phoneNumber(): string {
    return this.props.phoneNumber;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  markAsVerified(): void {
    this.props.isEmailVerified = true;
    this.props.updatedAt = new Date();
  }

  updatePassword(newHashedPassword: string): void {
    this.props.password = newHashedPassword;
    this.props.updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }
}
