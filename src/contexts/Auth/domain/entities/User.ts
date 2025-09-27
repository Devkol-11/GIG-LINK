export class User {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly password: string,
    private readonly createdAt: string
  ) {}
}
