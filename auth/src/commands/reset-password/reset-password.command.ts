export class ResetPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly phoneNumber?: string,
  ) {}
}
