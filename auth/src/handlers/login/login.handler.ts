import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from 'src/commands';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from 'src/dto/login.dto';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logger: LokiLoggerService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { email, password } = command;
    const user = await this.usersRepository.findOne({ where: { email } });
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
