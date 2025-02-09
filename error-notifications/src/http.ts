import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ValidationPipeObject } from '@pe/nest-kit';
import * as qs from 'qs';
import { AppModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 255,
      querystringParser: (str: string): any => qs.parse(str),
      trustProxy: environment.trustedProxies,
    }),
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.enableShutdownHooks();

  const options: any = new DocumentBuilder()
    .setTitle('Error notifications App')
    .setDescription('Error notifications App API')
    .setVersion('1.0')
    .addServer('/api/', 'main')
    .addTag('error-notifications')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Error notifications app started at port ${environment.port}`, 'NestApplication'),
  );
}

bootstrap().catch();
