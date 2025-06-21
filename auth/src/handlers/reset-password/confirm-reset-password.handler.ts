import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmResetPasswordCommand } from 'src/commands/reset-password/confirm-reset-password.command';
import { RedisService } from 'src/redis/redis.service';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(ConfirmResetPasswordCommand)
export class ConfirmResetPasswordHandler
  implements ICommandHandler<ConfirmResetPasswordCommand>
{
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LokiLoggerService,
  ) {}
  async execute(command: ConfirmResetPasswordCommand) {
    const { email, code } = command;
    this.logger.info(`Confirming reset password for user ${email}`);
    const dataRaw = await this.redisService.get(`reset-password:${email}`);
    if (!dataRaw) {
      this.logger.error(`No data for user ${email}`);
      throw new RpcException('No data for user');
    }
    const data = JSON.parse(dataRaw) as {
      email: string;
      code: string;
    };
    if (data.email !== email) {
      this.logger.error(`Email expired or invalid for user ${email}`);
      throw new RpcException('Email expired or invalid');
    }
    if (data.code !== code) {
      this.logger.error(`Code expired or invalid for user ${email}`);
      throw new RpcException('Code expired or invalid');
    }
    await this.redisService.del(`reset-password:${email}`);
    this.logger.info(`Reset password confirmed for user ${email}`);
  }
}
