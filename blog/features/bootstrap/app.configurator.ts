import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface, ProxyLogger } from '@pe/cucumber-sdk';
import { RABBITMQ_SERVER } from '@pe/nest-kit';
import { ApplicationModule } from '../../src/app.module';
import { useContainer } from 'class-validator';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    application.setGlobalPrefix('/api');
    application.useLogger(new ProxyLogger());
    useContainer(application.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });
    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
