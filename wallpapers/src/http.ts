import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { environment } from './environments';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 255,
    }),
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Wallpapers')
    .setDescription('The wallpapers API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('wallpaper')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Wallpapers app started at port [${environment.port}]`, 'NestApplication',
    ),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
