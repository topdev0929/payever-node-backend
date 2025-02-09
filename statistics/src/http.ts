import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import * as qs from 'qs';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
    querystringParser: (str: string): any => qs.parse(str),
    trustProxy: environment.trustedProxies,
  });

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(ApplicationModule, adapter);
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
    .setDescription('Statistics')
    .setVersion('1.0')
    .addServer('http://')
    .addTag('statistics')
    .addBearerAuth();

  if (environment.production) {
    options.addServer('http://');
  }

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options.build()));

  await app.listen(environment.port, '0.0.0.0', () =>
    logger.log(`Statistics app started at port ${environment.port}`, 'NestApplication'),
  );
}

void bootstrap().catch();
