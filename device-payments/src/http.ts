import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';

import { ValidationPipeObject } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<
    NestFastifyApplication
  >(AppModule, new FastifyAdapter());

  const logger: Logger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));

  if (environment.appCors) {
    app.enableCors({ origin: true, credentials: true });
  }

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Permissions')
    .setDescription('Permission micro API description')
    .setVersion('1.0')
    .addTag('permission')
    .addBearerAuth();
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    options.build(),
  );
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(
      `Device Payments app started at port [${environment.port}]`,
      'NestApplication',
    ),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
