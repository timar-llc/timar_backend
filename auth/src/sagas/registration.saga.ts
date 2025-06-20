// src/auth/sagas/registration.saga.ts
import { Injectable } from '@nestjs/common';
import { Saga, ofType, ICommand } from '@nestjs/cqrs';
import { Observable, map, filter, switchMap, takeUntil, timer } from 'rxjs';
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
    console.log('saga', events$);
    return events$.pipe(
      ofType(ConfirmationCodeSentEvent),
      switchMap((event) =>
        // Ждем подтверждения или таймаута, к примеру 1 минута
        events$.pipe(
          ofType(RegistrationConfirmedEvent, RegistrationFailedEvent),
          filter((e) => e.email === event.email),
          takeUntil(timer(60000)), // отмена если нет подтверждения 1 минута
          map((e) => {
            console.log('saga', e);
            if (e instanceof RegistrationConfirmedEvent) {
              // Пользователь подтвердил - можно сохранять в БД
              return new ConfirmRegistrationCommand(e.email, e.code);
            } else {
              // Пользователь не подтвердил - откат
              return new CancelRegistrationCommand(e.email);
            }
          }),
        ),
      ),
    );
  };
}
