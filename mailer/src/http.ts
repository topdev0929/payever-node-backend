import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import * as qs from 'qs';
import { environment } from './environments';
import { ApplicationModule } from './app.module';
import jwt from 'fastify-jwt';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter({
      bodyLimit: 100048576,
      querystringParser: (str: string): any => qs.parse(str),
    }),
  );

  await app.register(jwt, { secret: environment.jwtOptions.secret });
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.enableShutdownHooks();

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Mailer')
    .setDescription('The Mailer app API description')
    .setVersion('1.0')
    .addTag('mailer')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Mailer app started at port ${environment.port}`, 'NestApplication'),
  );
}
bootstrap().catch();
