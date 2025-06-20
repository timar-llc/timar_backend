import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ConfirmRegistrationCommand } from 'src/commands/registration/confirm-registration.command';
import { RedisService } from '../../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { InjectPinoLogger } from 'nestjs-pino';

@Injectable()
@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectPinoLogger('AUTH_SERVICE.ConfirmRegistrationHandler')
    private readonly logger: PinoLogger,
  ) {}

  async execute(command: ConfirmRegistrationCommand) {
    const { email, code } = command;
    this.logger.info(`Confirming registration for user ${email}`);
    const dataRaw = await this.redisService.get(`registration:${email}`);

    if (!dataRaw) {
      this.logger.error(`Code expired or invalid for user ${email}`);
      throw new Error('Code expired or invalid');
    }
    const data = JSON.parse(dataRaw) as {
      email: string;
      passwordHash: string;
      code: string;
    };
    if (data.email !== email) {
      this.logger.error(`Email expired or invalid for user ${email}`);
      throw new Error('Email expired or invalid');
    }
    if (data.code !== code) {
      this.logger.error(`Code expired or invalid for user ${email}`);
      throw new Error('Code expired or invalid');
    }

    // Создаем пользователя в БД
    const user = this.usersRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      verificationCode: data.code,
    });
    await this.usersRepository.save(user);
    this.logger.info(`User ${email} confirmed successfully`);

    // Удаляем из Redis
    await this.redisService.del(`registration:${email}`);
    this.logger.info(`User ${email} deleted from Redis`);
  }
}
