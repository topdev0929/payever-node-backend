import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { useContainer } from 'class-validator';

import { ValidationPipeObject, RABBITMQ_SERVER } from '@pe/nest-kit';
import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator {
  public setup(application: INestApplication): void {
    application.connectMicroservice<MicroserviceOptions>({
      strategy: application.get(RABBITMQ_SERVER),
    });

    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    useContainer(application.select(ApplicationModule), { fallbackOnErrors: true });

    application.setGlobalPrefix('/api');
  }
}
