import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ValidationPipeObject } from '@pe/nest-kit';
import { AppModule } from './app.module';
import { environment } from './environments';
import * as qs from 'qs';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter(
    {
      maxParamLength: 255,
      querystringParser: (str: string): any => qs.parse(str),
    },
  );

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Studio API')
    .setDescription('Studio API')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag(environment.applicationName)
    .addBearerAuth();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(environment.port, '0.0.0.0', (): void =>
    logger.log(
      `${environment.applicationName} app started at port [${environment.port}]`,
      'NestApplication',
    ),
  );
}

bootstrap().catch();
