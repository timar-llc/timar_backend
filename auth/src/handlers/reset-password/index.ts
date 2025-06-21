import { ConfirmResetPasswordHandler } from './confirm-reset-password.handler';
import { ResetPasswordHandler } from './reset-password.handler';

export const ResetPasswordCommandHandlers = [
  ConfirmResetPasswordHandler,
  ResetPasswordHandler,
];
