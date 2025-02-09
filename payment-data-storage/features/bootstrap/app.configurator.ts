import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ProxyLogger } from '@pe/cucumber-sdk';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.useLogger(new ProxyLogger());
    application.useGlobalPipes(new ValidationPipe({ transform: true }));
    application.setGlobalPrefix('/api');
  }
}
