import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import jwt from 'fastify-jwt';
import multipart from '@fastify/multipart';
import { FastifyServerOptions } from 'fastify';
import { ApplicationModule } from './app.module';
import { environment } from './environments';


async function bootstrap(): Promise<void> {
  const fastifyOptions: FastifyServerOptions = {
    bodyLimit: 1024 * 1024 * 500,
    maxParamLength: 255,    
  };
  const app: NestFastifyApplication = await NestFactory.create(ApplicationModule, new FastifyAdapter(fastifyOptions));

  await app.register(jwt, { secret: environment.jwtOptions.secret });
  await app.register(multipart, {
    limits: {
      fileSize: 1024 * 1024 * 500,
    },
  });
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  const options: any = new DocumentBuilder()
    .setTitle('Payever Media')
    .setDescription('Media API')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();
  await app.listen(environment.port, '0.0.0.0', () => logger.log(`Media app started at port [${environment.port}]`));
}
// tslint:disable-next-line no-floating-promises
bootstrap().catch((e: Error) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
