// tslint:disable: no-floating-promises
import { ArgvQueueNameExtractor, ProviderNameTransformer } from '@pe/nest-kit/modules/rabbit-mq';
import { INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Consumer } from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { environment } from './environments';

// need to declare env pod type and consumer before ApplicationModule
process.env.pod = 'consumer';
process.env.consumer = 'builder';
const queueArg: string = ArgvQueueNameExtractor.extract(process.argv);
if (queueArg) {
  if (queueArg === 'folder') {
    process.env.consumer = 'folder';
  }
  if (queueArg === 'folder-export') {
    process.env.consumer = 'folder-export';
  }
}
import { ApplicationModule } from './app.module';

async function bootstrap(): Promise<void> {
  const context: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);
  let queueName: string = environment.rabbitChannel;

  if (queueArg) {
    if (queueArg === 'folder') {
      queueName = environment.rabbitChannelFolder;
    }
    if (queueArg === 'folder-export') {
      queueName = environment.rabbitChannelFolderExport;
    }
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

  app.listen(() => logger.log(`Consumer started`, 'NestApplication'));
}

bootstrap().then();
