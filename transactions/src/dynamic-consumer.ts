import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Consumer } from '@pe/nest-kit';
import { ProviderNameTransformer, ArgvQueueNameExtractor } from '@pe/nest-kit/modules/rabbit-mq';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { ExporterDynamicService } from './transactions/services';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);
  context.enableShutdownHooks();

  const queueName: string = ArgvQueueNameExtractor.extract(process.argv);
  const consumerName: string = ProviderNameTransformer.transform(queueName);
  const server: Consumer = context.get(consumerName);

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    strategy: server,
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);
  // NOTE: There was a bug in dynamic queue, where we did not get events in our queue.
  // To fix this we have to call this method in app bootstrap itself
  const exporterService: ExporterDynamicService = app.get(ExporterDynamicService);
  app.listen(() => {
    logger.log(`${queueName} consumer started`, 'NestApplication');
    setTimeout(
      /* eslint @typescript-eslint/no-misused-promises: 0 */
      async (): Promise<void> => {
        await exporterService.executeInitial();
      },
      20000,
    );
  });
}

bootstrap().catch();
