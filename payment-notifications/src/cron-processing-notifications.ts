import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { SendProcessingPaymentNotificationsCron } from './payment-notifications/cron';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    strategy: context.get(SendProcessingPaymentNotificationsCron),
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Processing Payment Notifications cron started`, 'NestApplication'));
}
bootstrap().catch();
