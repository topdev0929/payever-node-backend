import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ValidationPipeObject } from '@pe/nest-kit';
import { useContainer } from 'class-validator';
import jwt from 'fastify-jwt';

import { environment } from './environments';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
  });

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));

  // tslint:disable-next-line no-floating-promises
  app.register(jwt, { secret: environment.jwtOptions.secret });
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Web widgets')
    .setDescription('The welcome app API description')
    .setVersion('1.0')
    .addBearerAuth();
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options.build()));

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Web widgets app started at port ${environment.port}`, 'NestApplication'),
  );
}
bootstrap().catch();
