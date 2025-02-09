import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ArgvQueueNameExtractor, ProviderNameTransformer, Consumer } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ApplicationModule } from './app.module';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);
  const queueName: string = ArgvQueueNameExtractor.extract(process.argv);
  const consumerName: string = ProviderNameTransformer.transform(queueName);
  const server: Consumer = context.get(consumerName);

  const app: INestMicroservice = await NestFactory.createMicroservice(ApplicationModule, {
    strategy: server,
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`${queueName} consumer started`, 'NestApplication'));
}

bootstrap().catch();
