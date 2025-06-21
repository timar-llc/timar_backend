import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,

    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_SERVER ?? 'amqp://localhost:5672'],
        queue: 'auth-service',
        noAck: true,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useLogger(app.get(LokiLoggerService));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
