import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging';
import { useContainer } from 'class-validator';
import jwt from 'fastify-jwt';
import fastifyMultipart from 'fastify-multipart';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
  });
  adapter.register(fastifyMultipart);

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    adapter,
    {
      // logger: false,
    },
  );

// tslint:disable-next-line: no-floating-promises
  app.register(jwt, { secret: environment.jwtOptions.secret });
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.enableShutdownHooks();
  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Plugins')
    .setDescription('The Plugins micro')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('plugins')
    .addBearerAuth();


  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options.build()));

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Plugins app started at port ${environment.port}`, 'NestApplication'),
  );
}

// tslint:disable-next-line: no-floating-promises
bootstrap().then();
