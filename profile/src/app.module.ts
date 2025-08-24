import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { LokiLoggerModule } from '@djeka07/nestjs-loki-logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileHandler } from './handlers/create-profile.handler';
import { EditBasicInfoHandler } from './handlers/edit-basic-info.handler';
import { GetMeHandler } from './handlers/get-me.handler';
import { StorageModule } from './config/s3/s3.module';
import { EditAvatarHandler } from './handlers/edit-avatar.handler';
import { SetAvatarHandler } from './handlers/set-avatar.handler';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CqrsModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, // в проде отключить!
      entities: [Profile],
    }),
    TypeOrmModule.forFeature([Profile]),
    StorageModule,
    LokiLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          app: 'PROFILE_SERVICE',
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
  ],
  controllers: [AppController],
  providers: [
    CreateProfileHandler,
    EditBasicInfoHandler,
    GetMeHandler,
    EditAvatarHandler,
    SetAvatarHandler,
  ],
})
export class AppModule {}
