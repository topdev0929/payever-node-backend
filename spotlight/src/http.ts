import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ValidationPipeObject } from '@pe/nest-kit';

import { AppModule } from './app.module';
import { environment } from './environments';

(async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter();
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const logger: Logger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));

  app.setGlobalPrefix('/api');

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Spotlight')
    .setDescription('The Spotlight micro')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('spotlight')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Spotlight app started at port [${environment.port}]`, 'NestApplication'),
  );
})().catch((e: any) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
