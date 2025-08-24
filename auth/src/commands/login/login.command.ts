export class LoginCommand {
  constructor(
    public readonly phoneNumber: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
