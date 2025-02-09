import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RABBITMQ_SERVER } from '@pe/nest-kit';

export class AppConfigurator {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe());
    application.setGlobalPrefix('/api');

    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
