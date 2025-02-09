import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { RABBITMQ_SERVER } from '@pe/nest-kit';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe());
    application.setGlobalPrefix('/api');

    useContainer(application.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });

    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
