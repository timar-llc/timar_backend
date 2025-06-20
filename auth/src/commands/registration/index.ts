import { RegisterHandler } from 'src/handlers/registration/register.handler';
import { ConfirmRegistrationHandler } from 'src/handlers/registration/confirm-registration.handler';
import { CancelRegistrationHandler } from 'src/handlers/registration/cancel-registration.handler';

export const CommandHandlers = [
  RegisterHandler,
  ConfirmRegistrationHandler,
  CancelRegistrationHandler,
];
