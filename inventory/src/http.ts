import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void>  {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter({
      maxParamLength: 255,
    }),
  );
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('/api');
  useContainer(app.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Inventory')
    .setDescription('The Inventory micro')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('inventory')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Inventory app started at port ${environment.port}`, 'NestApplication'),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
