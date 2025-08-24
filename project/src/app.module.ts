import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { LokiLoggerModule } from '@djeka07/nestjs-loki-logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { GetCountriesHandler } from './handlers/get-countries.handler';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['accept-language']),
        AcceptLanguageResolver,
      ],
    }),
    CqrsModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Country],
      synchronize: true, // в проде отключить!
    }),
    TypeOrmModule.forFeature([Country]),
    LokiLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          app: 'PROJECT_SERVICE',
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
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService, GetCountriesHandler],
})
export class AppModule {}
