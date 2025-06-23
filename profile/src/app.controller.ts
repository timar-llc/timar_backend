import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateProfileCommand } from './commands/create-profile.command';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LokiLoggerService,
    private readonly commandBus: CommandBus,
  ) {}

  @EventPattern('auth.user.created')
  async createProfile(@Payload() dto: CreateProfileDto) {
    this.logger.info(`Creating profile for ${dto.userUuid}`);
    await this.commandBus.execute(new CreateProfileCommand(dto.userUuid));
    return { success: true, message: 'Profile created' };
  }
}
