import { useContainer } from 'class-validator';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ApplicationModule } from '../../src/app.module';
import { NestKitLogger } from '@pe/nest-kit/modules/logging';
import { ProviderNameTransformer } from '@pe/nest-kit/modules/rabbit-mq';
import { RabbitChannel } from '../../src/notifications/enums/rabbit-channel.enum';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    useContainer(application.select(ApplicationModule), {
      fallback: true,
      fallbackOnErrors: true,
    });

    const logger: NestKitLogger = application.get(NestKitLogger);
    application.useLogger(logger);
    application.useGlobalPipes(new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }));

    const consumerName: string = ProviderNameTransformer.transform(RabbitChannel.Notifications);
    application.setGlobalPrefix('');
    application.connectMicroservice({
      strategy: application.get(consumerName),
    });
  }
}
