import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Technology } from './entities/technology.entity';
import {
  GetOrCreateTechnologyParams,
  TechnologyParams,
} from './params/technology.params';
import { GetTechnologiesQuery } from './queries/get-technologies.query';
import { GetTechnologyQuery } from './queries/get-technology.query';
import { GetUserTechnologiesQuery } from './queries/get-users-technologies.query';
import { AddUserTechnologyCommand } from './commands/add-user-technology.command';
import { RemoveUserTechnologyCommand } from './commands/remove-user-technology.command';
import { AddUserTechnologyParams } from './params/add-user-technology.params';
import { ToggleUserTechnologyParams } from './params/remove-user-technology.params';

@Controller()
export class AppController {
  constructor(
    private readonly logger: LokiLoggerService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern('technology.get_technologies')
  async getTechnologies(
    @Payload('params') params: TechnologyParams,
  ): Promise<Technology[]> {
    try {
      this.logger.info('Getting technologies');
      return await this.queryBus.execute(new GetTechnologiesQuery(params));
    } catch (error) {
      this.logger.error('Error getting technologies', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('technology.get_user_technologies')
  async getUserTechnologies(
    @Payload('userUuid') userUuid: string,
  ): Promise<Technology[]> {
    try {
      this.logger.info(`Getting user technologies for ${userUuid}`);
      return await this.queryBus.execute(
        new GetUserTechnologiesQuery(userUuid),
      );
    } catch (error) {
      this.logger.error(
        `Error getting user technologies for ${userUuid}`,
        error,
      );
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('technology.get_or_create_technology')
  async getOrCreateTechnology(
    @Payload('params') params: GetOrCreateTechnologyParams,
  ): Promise<Technology> {
    try {
      this.logger.info(
        `Getting or creating technology for ${params.name}`,
        params,
      );
      return await this.queryBus.execute(new GetTechnologyQuery(params));
    } catch (error) {
      this.logger.error(
        `Error getting or creating technology for ${params.name}`,
        error,
      );
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('technology.add_user_technology')
  async addUserTechnology(@Payload() params: AddUserTechnologyParams) {
    this.logger.info(`Adding technology for ${params.name}`);
    try {
      await this.commandBus.execute(new AddUserTechnologyCommand(params));
      return { success: true, message: 'Technology added' };
    } catch (error) {
      this.logger.error(`Error adding technology for ${params.name}`, error);

      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('technology.remove_user_technology')
  async removeUserTechnology(@Payload() params: ToggleUserTechnologyParams) {
    this.logger.info(`Removing technology for ${params.technologyUuid}`);
    try {
      await this.commandBus.execute(new RemoveUserTechnologyCommand(params));
      return { success: true, message: 'Technology removed' };
    } catch (error) {
      this.logger.error(
        `Error removing technology for ${params.technologyUuid}`,
        error,
      );
      throw new RpcException(error.message as Error);
    }
  }
}
