import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from 'src/commands/reset-password/reset-password.command';
import { RedisService } from 'src/redis/redis.service';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LokiLoggerService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}
  async execute(command: ResetPasswordCommand) {
    const { email } = command;
    this.logger.info(`Resetting password for user ${email}`);
    const existingUserInRedis = await this.redisService.get(
      `reset-password:${email}`,
    );
    if (existingUserInRedis) {
      throw new RpcException('User already has reset password');
    }
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new RpcException('User not found');
    }
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Отправляем команду и ждём ack
    try {
      const result = await firstValueFrom(
        this.client.send(
          'notification.reset-password.send_reset_password_code',
          {
            email,
            code: confirmationCode,
          },
        ),
      );
      this.logger.info(`${result}`);
    } catch (error) {
      this.logger.error('Error sending reset password code', error);
      throw new RpcException('Error sending reset password code');
    }

    this.logger.info('Sending reset password code to notification service');
    // Сохраняем в Redis с TTL только после успешной отправки письма
    await this.redisService.set(
      `reset-password:${email}`,
      JSON.stringify({ email, code: confirmationCode }),
      600, // 10 минут TTL
    );
    this.logger.info('Reset password code saved in Redis');
  }
}
