import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import jwt from 'fastify-jwt';
import * as qs from 'qs';

import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
    querystringParser: (str: string): any => qs.parse(str),
  });

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(ApplicationModule, adapter);

  // tslint:disable-next-line no-floating-promises
  app.register(jwt, { secret: environment.jwtOptions.secret });
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  useContainer(app.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Welcome')
    .setDescription('The welcome app API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('blog')
    .addBearerAuth();
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options.build()));

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Blog app started at port ${environment.port}`, 'NestApplication'),
  );
}
bootstrap().catch();
