import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TelegramAuthCommand } from 'src/commands/social-auth/telegram-auth.command';

import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(TelegramAuthCommand)
export class TelegramAuthHandler
  implements ICommandHandler<TelegramAuthCommand>
{
  constructor(
    private readonly logger: LokiLoggerService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject('PROFILE_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}
  async execute(command: TelegramAuthCommand) {
    const { telegramAuthDto } = command;
    let user: User | null = null;
    this.logger.info(`Telegram auth for user ${telegramAuthDto.id}`);
    user = await this.usersRepository.findOne({
      where: { telegramId: telegramAuthDto.id },
    });
    if (!user) {
      user = this.usersRepository.create({
        telegramId: telegramAuthDto.id,
        email: telegramAuthDto.username,
      });
      user = await this.usersRepository.save(user);

      this.client.emit('auth.user.created', {
        userUuid: user.uuid,
      });
      if (telegramAuthDto.photo_url) {
        this.client.send('profile.user.set_avatar', {
          userUuid: user.uuid,
          avatar: telegramAuthDto.photo_url,
        });
      }
    }

    const payload = { sub: user.uuid, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    this.logger.log('Telegram auth successful');
    return { accessToken, refreshToken };
  }
}
