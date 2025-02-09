import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import fastifyCookie from 'fastify-cookie';
import jwt from 'fastify-jwt';
import fastifyMultipart from 'fastify-multipart';
import { ApplicationModule } from './app.module';
import { environment } from './environments';
import * as qs from 'qs';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
    querystringParser: (str: string): any => qs.parse(str),
    trustProxy: environment.trustedProxies,
  });
  adapter.register(fastifyMultipart);

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(ApplicationModule, adapter);
  // tslint:disable-next-line: no-floating-promises
  app.register(fastifyCookie);
  // tslint:disable-next-line: no-floating-promises
  app.register(jwt, { secret: environment.jwtOptions.secret });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('/api');
  useContainer(app.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Welcome')
    .setDescription('The welcome app API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('checkout')
    .addBearerAuth()
  ;

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Checkout app started at port ${environment.port}`, 'NestApplication'),
  );
}
bootstrap().catch();
