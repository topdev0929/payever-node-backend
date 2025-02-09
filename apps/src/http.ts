import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { ValidationPipeObject } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );
  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  if (environment.appCors) {
    app.enableCors();
  }

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Apps')
    .setDescription('The apps microservice API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('apps')
    .addBearerAuth();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Apps app started at port ${environment.port}`, 'NestApplication'),
  );
}

bootstrap().catch();
