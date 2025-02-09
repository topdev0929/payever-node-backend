import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { ApplicationModule } from './app.module';
import { LastTransactionTimeCron } from './checkout-analytics/cron';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);

  const app: INestMicroservice = await NestFactory.createMicroservice(ApplicationModule, {
    strategy: context.get(LastTransactionTimeCron),
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Last transaction time cron started`, 'NestApplication'));
}

bootstrap().catch();
