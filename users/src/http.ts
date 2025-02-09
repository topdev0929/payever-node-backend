import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ValidationPipeObject } from '@pe/nest-kit';
import { useContainer } from 'class-validator';
import * as qs from 'qs';
import fastifyMultipart from 'fastify-multipart';

import { AppModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 255,
      querystringParser: (str: string): any => qs.parse(str),
    }),
  );

  await app.register(fastifyMultipart);

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe(ValidationPipeObject({ transform: true, whitelist: false, forbidNonWhitelisted: false })),
  );
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('User')
    .setDescription('The user API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('user')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(
    environment.port, '0.0.0.0',
    () => logger.log(`Users app started at port [${environment.port}]`, 'NestApplication'),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
