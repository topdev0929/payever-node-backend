import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RABBITMQ_SERVER } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';

import { ApplicationModule } from './app.module';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);

  const app: INestMicroservice = await NestFactory.createMicroservice(ApplicationModule, {
    strategy: context.get(RABBITMQ_SERVER),
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.enableShutdownHooks();
  app.listen(() => logger.log('Consumers started'));

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
bootstrap().catch();
