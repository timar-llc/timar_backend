import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterCommand } from 'src/commands/registration/register.command';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { firstValueFrom } from 'rxjs';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly redisService: RedisService,
    private readonly eventBus: EventBus,
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
    private readonly logger: LokiLoggerService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(command: RegisterCommand) {
    const { email, password } = command;

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUserInRedis = await this.redisService.get(
      `registration:${email}`,
    );
    if (existingUserInRedis) {
      console.log('existingUserInRedis', existingUserInRedis);
      throw new RpcException('User already registered');
    }
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new RpcException('User already registered');
    }

    // Генерируем код подтверждения
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Отправляем команду и ждём ack
    const result = await firstValueFrom(
      this.client.send('notification.registration.send_registration_code', {
        email,
        code: confirmationCode,
      }),
    );
    console.log(result);

    this.logger.info('Sending registration code to notification service');
    // Сохраняем в Redis с TTL только после успешной отправки письма
    await this.redisService.set(
      `registration:${email}`,
      JSON.stringify({ email, passwordHash, code: confirmationCode }),
      600, // 10 минут TTL
    );
    this.logger.info('Registration code saved in Redis');

    return { success: true, message: 'Registration initiated' };

    // Публикуем событие — код подтверждения успешно отправлен
  }
}
