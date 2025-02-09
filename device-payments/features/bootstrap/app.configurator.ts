import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { ValidationPipeObject, RABBITMQ_SERVER } from '@pe/nest-kit';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject()));
    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
