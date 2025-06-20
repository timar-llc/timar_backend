import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
