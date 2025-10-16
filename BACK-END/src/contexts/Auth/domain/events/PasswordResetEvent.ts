export class PasswordResetEvent {
  public readonly event_type = "Password_Reset_Requested_Event";
  public readonly routing_key = "auth.password_reset.requested";
  public readonly timeStamp = new Date();

  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly token: string
  ) {}
}
