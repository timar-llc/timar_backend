import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from './entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { RegistrationSaga } from './sagas/registration.saga';
import { CommandHandlers } from './commands/registration';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
      synchronize: true, // в проде отключить!
    }),
    TypeOrmModule.forFeature([User]),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV') as string;

        if (nodeEnv === 'dev') {
          return {
            pinoHttp: {
              transport: { target: 'pino-pretty' },
              level: 'debug',
            },
          };
        } else {
          return {
            pinoHttp: {
              transport: {
                target: 'pino-socket',
                options: {
                  address: configService.get('LOGGER_HOST') as string,
                  port: configService.get('LOGGER_PORT') as number,
                  mode: 'tcp',
                  reconnect: true,
                  recovery: true,
                },
              },
              level: 'info',
            },
          };
        }
      },
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [RegistrationSaga, ...CommandHandlers],
})
export class AppModule {}
