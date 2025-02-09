import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import * as qs from 'qs';

import { ApplicationModule } from './app.module';
import { environment } from './environments';
import multipart from '@fastify/multipart';
import { FastifyServerOptions } from 'fastify';

async function bootstrap(): Promise<void> {
  const fastifyOptions: FastifyServerOptions = {
    bodyLimit: 524288000,
    maxParamLength: 524288000,
    querystringParser: (str: string): any => qs.parse(str),
  };
  const app: NestFastifyApplication = await NestFactory.create(ApplicationModule, new FastifyAdapter(fastifyOptions));

  await app.register(multipart, { attachFieldsToBody: true });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ origin: true, credentials: true, maxAge: 600 });
  }

  app.enableShutdownHooks();

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Social')
    .setDescription('Social micro API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('social')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Social app started at port ${environment.port}`, 'NestApplication'),
  );
}

bootstrap().catch();
