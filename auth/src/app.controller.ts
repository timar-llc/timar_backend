import { Controller, OnApplicationBootstrap } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RegisterCommand } from './commands/registration/register.command';
import { ConfirmDto } from './dto/confirm-code.dto';
import { RegistrationConfirmedEvent } from './events/registration';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    @InjectPinoLogger('AuthService')
    private readonly logger: PinoLogger,
  ) {}

  onApplicationBootstrap() {
    this.logger.info('Subscribing to auth-service.register');
    this.logger.info('CommandBus initialized successfully');
  }

  @EventPattern('auth-service.register')
  async register(@Payload() dto: RegisterDto) {
    await this.commandBus.execute(new RegisterCommand(dto.email, dto.password));
  }

  @EventPattern('auth-service.confirm')
  async confirm(@Payload() dto: ConfirmDto) {
    this.logger.info(`Confirming registration for user ${dto.email}`);
    await this.eventBus.publish(
      new RegistrationConfirmedEvent(dto.email, dto.code),
    );
  }
}
