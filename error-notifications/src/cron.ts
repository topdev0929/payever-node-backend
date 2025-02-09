import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { environment } from './environments';
import { SendNotificationErrorsCron } from './error-notifications/cron';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);

  environment.enableCron = false;

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    strategy: context.get(SendNotificationErrorsCron),
  });

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Error Notifications cron started`, 'NestApplication'));
}

bootstrap().catch();
