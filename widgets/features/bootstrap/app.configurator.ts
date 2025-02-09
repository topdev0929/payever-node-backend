import { HttpService, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { RABBITMQ_SERVER } from '@pe/nest-kit';
import { useContainer } from 'class-validator';
import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe());
    useContainer(application.select(ApplicationModule), { fallbackOnErrors: true });

    AxiosMock.mock(application.get(HttpService).axiosRef);

    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
