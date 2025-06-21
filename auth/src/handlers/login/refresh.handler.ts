import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RefreshCommand } from 'src/commands';
import { LoginResponseDto } from 'src/dto/login.dto';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: LokiLoggerService,
  ) {}
  async execute(command: RefreshCommand): Promise<LoginResponseDto> {
    const { refreshToken } = command;
    const decoded = this.jwtService.verify(refreshToken);
    const payload = { sub: decoded.sub, email: decoded.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    this.logger.log('Refresh successful');
    return { accessToken, refreshToken: newRefreshToken };
  }
}
