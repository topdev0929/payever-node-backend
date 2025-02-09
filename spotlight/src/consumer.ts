import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { RABBITMQ_SERVER } from '@pe/nest-kit/modules/rabbit-mq';
import { AppModule } from './app.module';

(async function bootstrap(): Promise<void> {

  const context: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);

  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      logger: false,
      strategy: context.get(RABBITMQ_SERVER),
    },
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Message consumer started`, 'NestApplication'));


})().catch((e: any) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
