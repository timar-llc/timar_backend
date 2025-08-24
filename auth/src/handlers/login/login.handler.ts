import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from 'src/commands';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from 'src/dto/login.dto';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/redis/redis.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logger: LokiLoggerService,
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { phoneNumber, email, password } = command;
    let user: User | null;
    if (phoneNumber) {
      user = await this.usersRepository.findOne({
        where: { phoneNumber },
      });
      if (!user) {
        throw new RpcException('User not found');
      }
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const result = await firstValueFrom(
        this.client.send('notification.login.send_login_code', {
          phoneNumber,
          code: confirmationCode,
        }),
      );
      console.log(result);
      await this.redisService.set(
        `login:${phoneNumber}`,
        JSON.stringify({ phoneNumber, code: confirmationCode }),
        600, // 10 минут TTL
      );
      return { accessToken: '', refreshToken: '' };
    } else {
      user = await this.usersRepository.findOne({
        where: { email },
      });
    }
    if (!user) {
      throw new RpcException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new RpcException('Invalid credentials');
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
    this.logger.log('Login successful');
    return { accessToken, refreshToken };
  }
}
