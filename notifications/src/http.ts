import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import jwt from 'fastify-jwt';
import * as qs from 'qs';
import { ApplicationModule } from './app.module';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    maxParamLength: 255,
    querystringParser: (str: string): any => qs.parse(str),
  });

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    adapter,
    {
      // logger: false,
    },
  );

  await app.register(jwt, { secret: environment.jwtOptions.secret });
  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  if (environment.appCors) {
    app.enableCors({ origin: true, credentials: true });
  }

  app.enableShutdownHooks();

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Notifications')
    .setDescription('Notifications micro API description')
    .setVersion('1.0')
    .addTag('notifications')
    .addBearerAuth();

  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options.build()));

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Notifications app started at port ${environment.port}`, 'NestApplication'),
  );
}
bootstrap().catch();
