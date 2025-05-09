import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { RABBITMQ_SERVER, ValidationPipeObject } from '@pe/nest-kit';
import * as cors from 'cors';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ transform: true, disableErrorMessages: false })));
    application.setGlobalPrefix('/api');

    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
        