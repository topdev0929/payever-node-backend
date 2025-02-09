import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { urlencoded } from 'body-parser';

import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication
    = await NestFactory.create<NestFastifyApplication>(ApplicationModule, new FastifyAdapter());

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.use(urlencoded({ limit: '200mb', extended: true, parameterLimit: 200000 }));

  const options: any = new DocumentBuilder()
    .setTitle('Marketing api')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('campaign')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();
  await app.listen(environment.port, '0.0.0.0', () => logger.log(`Marketing listening on ${environment.port}`));
}
bootstrap().catch();
