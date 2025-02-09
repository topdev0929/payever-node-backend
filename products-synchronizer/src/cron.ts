import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { environment } from './environments';
import { CronManager } from './synchronizer/cron';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(
    AppModule,
  );

  environment.enableCron = false;

  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      strategy: context.get(CronManager),
    },
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Cron started`, 'NestApplication'));
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
