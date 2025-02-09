// tslint:disable: no-floating-promises
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import multipart from '@fastify/multipart';
import { useContainer } from 'class-validator';
import { environment } from './environments';
import * as qs from 'qs';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

// need to declare env pod type before ApplicationModule
process.env.pod = 'http';
import { ApplicationModule } from './app.module';

dotenv.config();
const env: ProcessEnv = process.env;
env.pod = 'http';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(
      {
        bodyLimit: 10485760,
        querystringParser: (str: string): any => qs.parse(str),
      },
    ),
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('/api');
  await app.register(multipart, {
    limits: {
      fileSize: 1024 * 1024 * 500,
    },
  });

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  const options: any = new DocumentBuilder()
    .setTitle('Builder Application')
    .setDescription('The Builder Application API description')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('builder-application')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.use(compression());

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(
      `Builder Application app started at port ${environment.port}`,
      'NestApplication',
    ),
  );
}

bootstrap().then();
