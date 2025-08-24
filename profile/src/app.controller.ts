import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateProfileCommand } from './commands/create-profile.command';
import { EditBasicInfoDto } from './dto/edit-basic-info.dto';
import { EditBasicInfoCommand } from './commands/edit-basic-info.command';
import { GetMeQuery } from './queries/get-me.query';
import { Profile } from './entities/profile.entity';
import { EditAvatarDto } from './dto/edit-avatar.dto';
import { EditAvatarCommand } from './commands/edit-avatar.command';
import { SetAvatarDto } from './dto/set-avatar.dto';
import { SetAvatarCommand } from './commands/set-avatar.command';

@Controller()
export class AppController {
  constructor(
    private readonly logger: LokiLoggerService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @EventPattern('auth.user.created')
  async createProfile(@Payload() dto: CreateProfileDto) {
    this.logger.info(`Creating profile for ${dto.userUuid}`);
    await this.commandBus.execute(new CreateProfileCommand(dto.userUuid));
    return { success: true, message: 'Profile created' };
  }

  @MessagePattern('profile.user.set_avatar')
  async setAvatar(@Payload() dto: SetAvatarDto) {
    this.logger.info(`Setting avatar for ${dto.userUuid}`);
    await this.commandBus.execute(new SetAvatarCommand(dto));
    return { success: true, message: 'Avatar set' };
  }

  @MessagePattern('profile.get_me')
  async getMe(@Payload('userUuid') userUuid: string): Promise<Profile> {
    this.logger.info(`Getting me for ${userUuid}`);
    try {
      return await this.queryBus.execute(new GetMeQuery(userUuid));
    } catch (error) {
      this.logger.error(`Error getting me for ${userUuid}`, error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('profile.edit_avatar')
  async editAvatar(@Payload() dto: EditAvatarDto) {
    this.logger.info(`Editing avatar for ${dto.userUuid}`);
    try {
      await this.commandBus.execute(new EditAvatarCommand(dto));
      return { success: true, message: 'Avatar edited' };
    } catch (error) {
      this.logger.error(`Error editing avatar for ${dto.userUuid}`, error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('profile.edit_basic_info')
  async editBasicInfo(@Payload() dto: EditBasicInfoDto) {
    this.logger.info(`Editing basic info for ${dto.userUuid}`);
    try {
      await this.commandBus.execute(new EditBasicInfoCommand(dto));
      return { success: true, message: 'Basic info edited' };
    } catch (error) {
      this.logger.error(`Error editing basic info for ${dto.userUuid}`, error);
      throw new RpcException(error.message as Error);
    }
  }
}
