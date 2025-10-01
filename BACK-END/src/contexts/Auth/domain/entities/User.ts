import { DomainException } from "../exceptions/DomainException";
export interface UserProps {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(
    props: Omit<UserProps, "id" | "isEmailVerified" | "createdAt" | "updatedAt">
  ): User {
    const id = crypto.randomUUID();
    const now = new Date();

    // create a new user
    return new User({
      ...props,
      id,
      isEmailVerified: false,
      createdAt: now,
      updatedAt: now,
    });
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
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
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
    if (!email.includes("@")) {
      throw new DomainException("invalid email", 404);
    }
    this.props.email = email;
    this.props.updatedAt = new Date();
  }
}
