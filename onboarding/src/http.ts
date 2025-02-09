import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import fastifyMultipart from 'fastify-multipart';

import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart);

  const logger: Logger = app.get(NestKitLogger);
  app.useLogger(logger);

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true,
  }));
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Onboarding')
    .setDescription('The Onboarding micro')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('onboarding')
    .addBearerAuth();

  if (environment.production) {
    options.addServer('https://');
  }
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Onboarding app started at port [${environment.port}]`, 'NestApplication'),
  );
}
bootstrap().catch();
