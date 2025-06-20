export class ConfirmRegistrationCommand {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
