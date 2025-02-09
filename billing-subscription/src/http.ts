import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import * as qs from 'qs';
import { ApplicationModule } from './app.module';
import { environment } from './environments';
import { ValidationPipeObject } from '@pe/nest-kit';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
    querystringParser: (str: string): any => qs.parse(str),
  });

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(ApplicationModule, adapter);

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
  app.setGlobalPrefix('/api');

  const options: any = new DocumentBuilder()
    .setTitle('Welcome')
    .setDescription('The welcome app API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('checkout')
    .addBearerAuth();

  if (environment.production) {
    options.addServer('https://');
  }

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Billing subscription app started at port ${environment.port}`, 'NestApplication'),
  );
}
// tslint:disable-next-line no-floating-promises
bootstrap().then();
