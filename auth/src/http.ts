import { NestFactory } from '@nestjs/core';
import { ValidationPipe, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import * as qs from 'qs';
import * as requestIp from 'request-ip';
import { useContainer } from 'class-validator';
import fastifyMultipart from 'fastify-multipart';

import { ValidationPipeObject } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ApplicationModule } from './app.module';
import { environment } from './environments';
import { InfoTransformPipe } from './employees/pipes';

async function bootstrap(): Promise<void> {

  const fastifyOptions: FastifyServerOptions = {
    maxParamLength: 255,
    querystringParser: (str: string): any => qs.parse(str),
  };

  if (environment.trustedProxies) {
    fastifyOptions.trustProxy = environment.trustedProxies;
  }

  const app: NestFastifyApplication = await NestFactory.create(ApplicationModule, new FastifyAdapter(fastifyOptions));
  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true});

  const fastify: FastifyInstance = app.getHttpAdapter().getInstance();
  fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
  });

  fastify.addHook('onRequest', (request: any, reply: any, done: any) => {
    reply.setHeader = function(key: string, value: string): any {
      return this.raw.setHeader(key, value);
    };

    reply.end = function(): void {
      this.raw.end();
    };

    request.res = reply;

    done();
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  // Note: This line is temporary. It will be removed after FE changes
  app.useGlobalPipes(new InfoTransformPipe);
  
  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));

  app.enableCors({ origin: true, credentials: true, maxAge: 3600 });

  const options: any = new DocumentBuilder()
    .setTitle('Permissions')
    .setDescription('Permission micro API description')
    .setVersion('1.0')
    .addTag('permission')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  app.use(requestIp.mw());

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Auth application started at port [${environment.port}].`, 'NestApplication'),
  );
}

bootstrap().catch();
