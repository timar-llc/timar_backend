import { Injectable } from '@nestjs/common';
import { Saga, ofType, ICommand } from '@nestjs/cqrs';
import { Observable, map, filter, switchMap, race, timer } from 'rxjs';
import {
  ConfirmationCodeSentEvent,
  RegistrationConfirmedEvent,
  RegistrationFailedEvent,
} from '../events/registration';

import { CancelRegistrationCommand } from 'src/commands/registration/cancel-registration.command';
import { ConfirmRegistrationCommand } from 'src/commands/registration/confirm-registration.command';

@Injectable()
export class RegistrationSaga {
  @Saga()
  registration = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ConfirmationCodeSentEvent), // 1. Начало регистрации
      switchMap((event) => {
        const { email } = event;

        // 2. Поток подтверждения или ошибки
        const confirmationOrFailure$ = events$.pipe(
          ofType(RegistrationConfirmedEvent, RegistrationFailedEvent),
          filter((e) => e.email === email),
          map((e) => {
            if (e instanceof RegistrationConfirmedEvent) {
              return new ConfirmRegistrationCommand(e.email, e.code);
            } else {
              return new CancelRegistrationCommand(e.email);
            }
          }),
        );

        // 3. Поток тайм-аута — 1 минута
        const timeout$ = timer(60000).pipe(
          map(() => new CancelRegistrationCommand(email)),
        );

        // 4. Срабатывает первый из двух потоков
        return race(confirmationOrFailure$, timeout$);
      }),
    );
  };
}
