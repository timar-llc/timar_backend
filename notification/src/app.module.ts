import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MailerService } from './mailer/mailer.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CqrsModule.forRoot(),
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
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
