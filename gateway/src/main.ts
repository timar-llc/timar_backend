import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import metadata from 'src/metadata';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Gateway TIMAR BACKEND')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Bearer',
    )
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        enableCircularCheck: true,
      },
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useLogger(app.get(LokiLoggerService));
  await app.listen(process.env.PORT ?? 8000);
  console.log(
    `Gateway running at http://localhost:${process.env.PORT ?? 8000}/docs`,
  );
}
bootstrap();
