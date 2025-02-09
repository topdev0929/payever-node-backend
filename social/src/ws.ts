import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ApplicationModule } from './app.module';
import { CustomWsAdapter } from './ws/custom-adapter';
import { environment } from './environments';

async function bootstrap(): Promise<void> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  const logger: Logger = app.get(NestKitLogger);
  app.useLogger(logger);

  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  app.useWebSocketAdapter(
    new CustomWsAdapter(
      app.getHttpServer(),
      logger,
      environment.webSocket.port,
    ),
  );

  await app.startAllMicroservicesAsync();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Social WebSocket instance started at port [${environment.webSocket.port}]`, 'NestApplication'),
  );
}
bootstrap().catch();
