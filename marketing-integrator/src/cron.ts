import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { CronManager } from './integration';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(
    AppModule,
  );
  const logger: NestKitLogger = context.get(NestKitLogger);

  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      strategy: context.get(CronManager),
    },
  );

  context.useLogger(logger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Cron started`, 'NestApplication'));
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
