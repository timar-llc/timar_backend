import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CancelRegistrationCommand } from 'src/commands/registration/cancel-registration.command';
import { RedisService } from '../../redis/redis.service';
import { PinoLogger } from 'nestjs-pino';
import { InjectPinoLogger } from 'nestjs-pino';

@Injectable()
@CommandHandler(CancelRegistrationCommand)
export class CancelRegistrationHandler
  implements ICommandHandler<CancelRegistrationCommand>
{
  constructor(
    private readonly redisService: RedisService,
    @InjectPinoLogger('AUTH_SERVICE.CancelRegistrationHandler')
    private readonly logger: PinoLogger,
  ) {}

  async execute(command: CancelRegistrationCommand) {
    this.logger.info(`Cancelling registration for user ${command.email}`);
    await this.redisService.del(`registration:${command.email}`);
  }
}
