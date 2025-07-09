import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmRegistrationCommand } from 'src/commands/registration/confirm-registration.command';
import { RedisService } from '../../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { Inject } from '@nestjs/common';

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly logger: LokiLoggerService,
    @Inject('PROFILE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: ConfirmRegistrationCommand) {
    const { email, code } = command;
    this.logger.info(`Confirming registration for user ${email}`);
    const dataRaw = await this.redisService.get(`registration:${email}`);

    this.logger.info(`Data raw: ${dataRaw}`);
    if (!dataRaw) {
      this.logger.error(`No data for user ${email}`);
      throw new RpcException('No data for user');
    }
    const data = JSON.parse(dataRaw) as {
      email: string;
      passwordHash: string;
      code: string;
    };
    if (data.email !== email) {
      this.logger.error(`Email expired or invalid for user ${email}`);
      throw new RpcException('Email expired or invalid');
    }
    console.log('data.code', data.code, code);
    if (data.code !== code) {
      this.logger.error(`Code expired or invalid for user ${email}`);
      throw new RpcException('Code expired or invalid');
    }

    // Создаем пользователя в БД
    let user = this.usersRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      verificationCode: data.code,
    });
    user = await this.usersRepository.save(user);
    this.logger.info(`User ${email} confirmed successfully`);

    // Удаляем из Redis
    await this.redisService.del(`registration:${email}`);
    this.logger.info(`User ${email} deleted from Redis`);

    this.client.emit('auth.user.created', {
      userUuid: user.uuid,
    });
  }
}
