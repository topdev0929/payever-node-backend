import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Consumer } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ArgvQueueNameExtractor, ProviderNameTransformer } from '@pe/nest-kit/modules/rabbit-mq';
import { useContainer } from 'class-validator';
import { ApplicationModule } from './app.module';
import { environment } from './environments';
import { CustomWsAdapter } from './onboarding/ws/custom-ws.adapter';

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
      environment.webSocket.port as any,
      app.getHttpServer(),
      logger,
    ),
  );

  const queueName: string = ArgvQueueNameExtractor.extract(process.argv);
  const consumerName: string = ProviderNameTransformer.transform(queueName);
  const server: Consumer = app.get(consumerName);

  app.connectMicroservice({
    strategy: server,
  });

  await app.startAllMicroservicesAsync();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Onboarding WebSocket instance started`, 'NestApplication'),
  );
}
bootstrap().catch();
