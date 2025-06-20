export class ConfirmationCodeSentEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}

export class RegistrationConfirmedEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}

export class RegistrationFailedEvent {
  constructor(public readonly email: string) {}
}
