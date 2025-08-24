import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmLoginCommand } from 'src/commands/login/confirm-login.command';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { RpcException } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@CommandHandler(ConfirmLoginCommand)
export class ConfirmLoginHandler
  implements ICommandHandler<ConfirmLoginCommand>
{
  constructor(
    private readonly logger: LokiLoggerService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async execute(command: ConfirmLoginCommand) {
    const { phoneNumber, code } = command;
    const dataRaw = await this.redisService.get(`login:${phoneNumber}`);
    if (!dataRaw) {
      this.logger.error(`No data for user ${phoneNumber}`);
      throw new RpcException('No data for user');
    }
    const data = JSON.parse(dataRaw) as {
      phoneNumber: string;
      code: string;
    };
    if (data.phoneNumber !== phoneNumber) {
      this.logger.error(
        `Phone number expired or invalid for user ${phoneNumber}`,
      );
      throw new RpcException('Phone number expired or invalid');
    }
    if (data.code !== code) {
      this.logger.error(`Code expired or invalid for user ${phoneNumber}`);
      throw new RpcException('Phone number expired or invalid');
    }
    const user = await this.usersRepository.findOne({
      where: { phoneNumber },
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    await this.redisService.del(`login:${phoneNumber}`);
    this.logger.info(`Login confirmed for user ${phoneNumber}`);
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
