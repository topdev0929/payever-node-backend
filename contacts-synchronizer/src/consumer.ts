import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RABBITMQ_SERVER } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(
    AppModule,
  );

  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      strategy: context.get(RABBITMQ_SERVER),
    },
  );

  const logger: NestKitLogger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.listen(() => logger.log(`Consumer started`, 'NestApplication'));
}

bootstrap().catch();
