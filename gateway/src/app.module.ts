import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LokiLoggerModule } from '@djeka07/nestjs-loki-logger';
import { ClientsModule } from './modules/clients/clients.module';
import {
  AuthModule,
  GeolocationModule,
  ProfileModule,
  ProjectModule,
  TechnologyModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LokiLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          app: 'GATEWAY',
          host: `http://${configService.get('LOGGER_HOST')}:${configService.get('LOGGER_PORT') as string}`,
          userId: configService.get('LOGGER_USERNAME') as string,
          password: configService.get('LOGGER_PASSWORD') as string,

          environment:
            configService.get('NODE_ENV') === 'dev'
              ? 'development'
              : 'production',
          logDev: false,
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule,
    AuthModule,
    GeolocationModule,
    TechnologyModule,
    ProfileModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
