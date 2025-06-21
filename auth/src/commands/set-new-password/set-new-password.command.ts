export class SetNewPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
