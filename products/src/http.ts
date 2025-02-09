import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { ValidationPipeObject } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { environment } from './environments';
import { useContainer } from 'class-validator';
import * as qs from 'qs';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({
      querystringParser: (str: string): any => qs.parse(str),
    },
  ));
  const logger: Logger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Welcome')
    .setDescription('The welcome app API description')
    .setVersion('1.0')
    .addTag('todo')
    .addBearerAuth();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options.build()));

  app.enableShutdownHooks();

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Products app started at port [${environment.port}]`, 'NestApplication'),
  );
}

bootstrap().then().catch();
