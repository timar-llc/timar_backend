import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { firstValueFrom } from 'rxjs';
import { EditBasicInfoDto } from './dto/edit-basic-info.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RemoveTechnologyDto } from './dto/remove-user-technology.dto';
import { AddTechnologyDto } from './dto/add-user-technology.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDto } from './dto/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject('PROFILE_SERVICE') private readonly profileClient: ClientProxy,
    private readonly logger: LokiLoggerService,
    @Inject('TECHNOLOGY_SERVICE')
    private readonly technologyClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async getProfile(@CurrentUser() userUuid: string): Promise<ProfileDto> {
    try {
      this.logger.info(`Getting profile for ${userUuid}`);
      return await firstValueFrom(
        this.profileClient.send('profile.get_me', { userUuid }),
      );
    } catch (error) {
      this.logger.error(`Error getting profile for ${userUuid}`, error);
      throw new RpcException(error.message as Error);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @Post('edit-basic-info')
  async editBasicInfo(
    @Body() dto: EditBasicInfoDto,
    @CurrentUser() userUuid: string,
  ) {
    try {
      this.logger.info(`Editing basic info for ${userUuid}`);
      return await firstValueFrom(
        this.profileClient.send('profile.edit_basic_info', {
          userUuid,
          ...dto,
        }),
      );
    } catch (error) {
      this.logger.error(`Error editing basic info for ${userUuid}`, error);
      throw new RpcException(error.message as Error);
    }
  }

  @Post('edit-avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  async editAvatar(
    @CurrentUser() userUuid: string,
    @UploadedFile()
    avatar: Express.Multer.File,
  ) {
    const fileData = {
      fieldname: avatar.fieldname,
      originalname: avatar.originalname,
      encoding: avatar.encoding,
      mimetype: avatar.mimetype,
      buffer: avatar.buffer.toString('base64'),
      size: avatar.size,
    };

    return await firstValueFrom(
      this.profileClient.send('profile.edit_avatar', {
        userUuid,
        avatar: fileData,
      }),
    );
  }

  @Get('technologies')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async getTechnologies(@CurrentUser() userUuid: string) {
    return await firstValueFrom(
      this.technologyClient.send('technology.get_user_technologies', {
        userUuid,
      }),
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @Post('technologies')
  async addTechnology(
    @Body() dto: AddTechnologyDto,
    @CurrentUser() userUuid: string,
  ) {
    try {
      this.logger.info(`Adding technology for ${dto.name}`);
      return await firstValueFrom(
        this.technologyClient.send('technology.add_user_technology', {
          name: dto.name,
          userUuid,
        }),
      );
    } catch (error) {
      this.logger.error(`Error adding technology for ${dto.name}`, error);
      throw new RpcException(error.message as Error);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @Delete('technologies')
  async removeTechnology(
    @Body() dto: RemoveTechnologyDto,
    @CurrentUser() userUuid: string,
  ) {
    try {
      this.logger.info(`Removing technology for ${dto.technologyUuid}`);
      return await firstValueFrom(
        this.technologyClient.send('technology.remove_user_technology', {
          technologyUuid: dto.technologyUuid,
          userUuid,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error removing technology for ${dto.technologyUuid}`,
        error,
      );
      throw new RpcException(error.message as Error);
    }
  }
}
