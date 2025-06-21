import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelRegistrationCommand } from 'src/commands/registration/cancel-registration.command';
import { RedisService } from '../../redis/redis.service';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

@CommandHandler(CancelRegistrationCommand)
export class CancelRegistrationHandler
  implements ICommandHandler<CancelRegistrationCommand>
{
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LokiLoggerService,
  ) {}

  async execute(command: CancelRegistrationCommand) {
    this.logger.info(`Cancelling registration for user ${command.email}`);
    await this.redisService.del(`registration:${command.email}`);
  }
}
