import { useContainer } from 'class-validator';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  Consumer,
  ProviderNameTransformer,
  RabbitMqConfig,
} from '@pe/nest-kit';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';

import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    useContainer(application.select(ApplicationModule), {
      fallback: true,
      fallbackOnErrors: true,
    });
    const logger: NestKitLogger = application.get(NestKitLogger);
    application.useLogger(logger);
    application.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      })
    );
    application.setGlobalPrefix('');
    const config: RabbitMqConfig = application.get(RabbitMqConfig);
    const queueNames: string[] = config.getQueuesNames();

    for (const queue of queueNames) {
      const provider: string = ProviderNameTransformer.transform(queue);
      const consumer: Consumer = application.get(provider);

      application.connectMicroservice({
        strategy: consumer,
      });
    }
  }
}
