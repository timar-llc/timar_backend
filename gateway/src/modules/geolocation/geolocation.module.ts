import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeolocationController } from './geolocation.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GEOLOCATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('RABBITMQ_SERVER') as string],
              queue: 'geolocation-service',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    CacheModule.register({
      ttl: 60 * 60 * 24,
    }),
  ],
  controllers: [GeolocationController],
  providers: [],
})
export class GeolocationModule {}
