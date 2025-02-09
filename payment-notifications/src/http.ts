import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ValidationPipeObject } from '@pe/nest-kit';
import jwt from 'fastify-jwt';

import { AppModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 255,
      trustProxy: environment.trustedProxies,
    }),
  );

  // tslint:disable-next-line no-floating-promises
  app.register(jwt, { secret: environment.jwtOptions.secret});
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.enableShutdownHooks();

  const options: any = new DocumentBuilder()
    .setTitle('Payment notifications App')
    .setDescription('Payment notifications App API')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('payment-notifications')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Payment notifications app started at port ${environment.port}`, 'NestApplication'),
  );
}
// tslint:disable-next-line no-floating-promises
bootstrap().then();
