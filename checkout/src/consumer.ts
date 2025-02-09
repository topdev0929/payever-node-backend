import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Consumer } from '@pe/nest-kit';
import { ProviderNameTransformer, ArgvQueueNameExtractor } from '@pe/nest-kit/modules/rabbit-mq';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import { ApplicationModule } from './app.module';

fastify().register(fastifyCookie);

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);
  const queueName: string = ArgvQueueNameExtractor.extract(process.argv);
  const consumerName: string = ProviderNameTransformer.transform(queueName);
  const server: Consumer = context.get(consumerName);

  const app: INestMicroservice = await NestFactory.createMicroservice(
    ApplicationModule,
    {
      logger: false,
      strategy: server,
    });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Checkout queue: ${queueName} consumer started`, 'NestApplication'));
}

bootstrap().catch();
