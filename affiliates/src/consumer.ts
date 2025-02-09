// tslint:disable: no-floating-promises
import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Consumer } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ArgvQueueNameExtractor, ProviderNameTransformer } from '@pe/nest-kit/modules/rabbit-mq';
import { ApplicationModule } from './app.module';
import { RabbitChannelsEnum } from './affiliates/enums';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);

  let queueName: string = ArgvQueueNameExtractor.extract(process.argv);
  if (!queueName) {
    queueName = RabbitChannelsEnum.Affiliates;
  }

  const consumerName: string = ProviderNameTransformer.transform(queueName);
  const server: Consumer = context.get(consumerName);

  const app: INestMicroservice = await NestFactory.createMicroservice(
    ApplicationModule,
    {
      strategy: server,
    },
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Affiliates queue: ${queueName} consumer started`, 'NestApplication'));
}

bootstrap().catch();
