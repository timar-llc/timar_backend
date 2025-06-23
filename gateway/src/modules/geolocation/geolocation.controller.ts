import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { firstValueFrom } from 'rxjs';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('geolocation')
@UseInterceptors(CacheInterceptor)
export class GeolocationController {
  constructor(
    @Inject('GEOLOCATION_SERVICE') private readonly client: ClientProxy,
    private readonly logger: LokiLoggerService,
  ) {}

  @Get('countries')
  async getCountries(): Promise<any> {
    try {
      this.logger.info('Getting countries');
      return await firstValueFrom(
        this.client.send('geolocation.get_countries', {}),
      );
    } catch (error) {
      this.logger.error('Error getting countries', error);
      throw new RpcException(error.message as Error);
    }
  }
}
