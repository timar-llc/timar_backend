import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TechnologyController } from './technology.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TECHNOLOGY_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('RABBITMQ_SERVER') as string],
              queue: 'technology-service',
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
  controllers: [TechnologyController],
  providers: [],
})
export class TechnologyModule {}
