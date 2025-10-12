export class UserRegisteredEvent {
  public readonly event_type = "User_Registered_Event";
  public readonly routing_key = "auth.registered";
  public readonly timeStamp = new Date();

  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}
