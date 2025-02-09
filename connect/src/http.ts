import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as qs from 'qs';

import { ValidationPipeObject } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter({
      maxParamLength: 255,
      querystringParser: (str: string): any => qs.parse(str),
    }),
    {
      logger: false,
    },
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ forbidNonWhitelisted: false })));
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Connect')
    .setDescription('The connect API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('connect')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.startAllMicroservicesAsync();
  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(
      `Connect app started at port ${environment.port}`,
      'NestApplication',
    ),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
