export class PasswordResetToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public used: boolean,
    public readonly createdAt: Date,
    public readonly expiresAt: Date
  ) {}

  markAsUsed() {
    this.used = true;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
