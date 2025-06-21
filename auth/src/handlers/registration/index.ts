import { RegisterHandler } from './register.handler';
import { ConfirmRegistrationHandler } from './confirm-registration.handler';
import { CancelRegistrationHandler } from './cancel-registration.handler';

export const RegistrationCommandHandlers = [
  RegisterHandler,
  ConfirmRegistrationHandler,
  CancelRegistrationHandler,
];
