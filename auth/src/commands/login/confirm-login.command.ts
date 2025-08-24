export class ConfirmLoginCommand {
  constructor(
    public readonly phoneNumber: string,
    public readonly code: string,
  ) {}
}
