import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { ApiQuery } from '@nestjs/swagger';

@Controller('technologies')
export class TechnologyController {
  constructor(
    @Inject('TECHNOLOGY_SERVICE') private readonly client: ClientProxy,
    private readonly logger: LokiLoggerService,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', type: String, required: false })
  async getTechnologies(@Query('search') search: string): Promise<any> {
    try {
      this.logger.info('Getting technologies');
      return await firstValueFrom(
        this.client.send('technology.get_technologies', { params: { search } }),
      );
    } catch (error) {
      this.logger.error('Error getting technologies', error);
      throw new RpcException(error.message as Error);
    }
  }
}
