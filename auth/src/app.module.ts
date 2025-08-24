import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from './entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LokiLoggerModule } from '@djeka07/nestjs-loki-logger';
import { RegistrationCommandHandlers } from './handlers/registration';
import { ResetPasswordCommandHandlers } from './handlers/reset-password';
import { SetNewPasswordHandler } from './handlers/set-new-password/set-new-password.handler';
import { LoginHandlers } from './handlers/login';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmLoginHandler } from './commands/login/confirm-login.handler';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_SERVER') as string],
            queue: 'notification-service',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PROFILE_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_SERVER') as string],
            queue: 'profile-service',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),

    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
    }),
    TypeOrmModule.forFeature([User]),
    LokiLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          app: 'AUTH_SERVICE',
          host: `http://${configService.get('LOGGER_HOST')}:${configService.get('LOGGER_PORT') as string}`,
          userId: configService.get('LOGGER_USERNAME') as string,
          password: configService.get('LOGGER_PASSWORD') as string,

          environment:
            configService.get('NODE_ENV') === 'dev'
              ? 'development'
              : 'production',
          logDev: true,
        };
      },
      inject: [ConfigService],
    }),

    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    ...RegistrationCommandHandlers,
    ...ResetPasswordCommandHandlers,
    ...LoginHandlers,
    SetNewPasswordHandler,
    ConfirmLoginHandler,
  ],
})
export class AppModule {}
