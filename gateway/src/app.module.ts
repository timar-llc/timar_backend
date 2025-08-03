import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LokiLoggerModule } from '@djeka07/nestjs-loki-logger';
import { GeolocationModule } from './modules/geolocation/geolocation.module';
import { TechnologyModule } from './modules/technology/technology.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ClientsModule } from './modules/clients/clients.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
