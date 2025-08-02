import { Controller, Get, Inject, Headers } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { firstValueFrom } from 'rxjs';

@Controller('geolocation')
export class GeolocationController {
  constructor(
    @Inject('GEOLOCATION_SERVICE') private readonly client: ClientProxy,
    private readonly logger: LokiLoggerService,
  ) {}

  @Get('countries')
  async getCountries(
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<any> {
    const lang = acceptLanguage || 'en';
    console.log('Language:', lang);
    try {
      this.logger.info('Getting countries');
      return await firstValueFrom(
        this.client.send('geolocation.get_countries', { lang }),
      );
    } catch (error) {
      this.logger.error('Error getting countries', error);
      throw new RpcException(error.message as Error);
    }
  }
}
