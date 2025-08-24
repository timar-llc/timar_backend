export class ConfirmResetPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly phoneNumber?: string,
  ) {}
}
