export class ConfirmResetPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
