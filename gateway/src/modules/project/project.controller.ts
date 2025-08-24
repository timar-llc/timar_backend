import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateProjectDto } from './dto/create-project.dto';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientProxy,
    private readonly logger: LokiLoggerService,
  ) {}

  @Get()
  async getProjects() {
    try {
      this.logger.info('Getting projects');
      return await firstValueFrom(this.projectClient.send('project.get', {}));
    } catch (error) {
      this.logger.error('Error getting projects', error);
      throw new RpcException(error.message as Error);
    }
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto) {
    try {
      this.logger.info('Creating project', dto);
      return await firstValueFrom(
        this.projectClient.send('project.create', dto),
      );
    } catch (error) {
      this.logger.error('Error creating project', error);
      throw new RpcException(error.message as Error);
    }
  }

  @Delete(':uuid')
  async deleteProject(@Param('uuid') uuid: string) {
    try {
      this.logger.info('Deleting project', uuid);
      return await firstValueFrom(
        this.projectClient.send('project.delete', uuid),
      );
    } catch (error) {
      this.logger.error('Error deleting project', error);
      throw new RpcException(error.message as Error);
    }
  }

  @Get(':uuid')
  async getProject(@Param('uuid') uuid: string) {
    try {
      this.logger.info('Getting project', uuid);
      return await firstValueFrom(
        this.projectClient.send('project.get_by_uuid', uuid),
      );
    } catch (error) {
      this.logger.error('Error getting project', error);
      throw new RpcException(error.message as Error);
    }
  }
  @Patch(':uuid')
  async updateProject(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProjectDto,
  ) {
    try {
      this.logger.info('Updating project', uuid, dto);
      return await firstValueFrom(
        this.projectClient.send('project.update', { uuid, dto }),
      );
    } catch (error) {
      this.logger.error('Error updating project', error);
      throw new RpcException(error.message as Error);
    }
  }
}
