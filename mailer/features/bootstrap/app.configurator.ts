import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RABBITMQ_SERVER } from '@pe/nest-kit';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.setGlobalPrefix('/api');
    application.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
