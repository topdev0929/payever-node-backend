import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  app.useStaticAssets({
    prefix: '/static/',
    root: path.join(__dirname, 'static'),
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ origin: true, credentials: true, maxAge: 600 });
  }

  app.enableShutdownHooks();

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Widgets')
    .setDescription('Widgets micro API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('widgets')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Widgets app started at port ${environment.port}`, 'NestApplication'),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
