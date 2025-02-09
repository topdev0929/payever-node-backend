import { INestApplication, ValidationPipe, HttpService } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppConfiguratorInterface, ProxyLogger } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { Consumer, RabbitMqConfig, ValidationPipeObject, ProviderNameTransformer } from '@pe/nest-kit';
import { AppModule } from '../../src/app.module';
import { AxiosInstance } from "axios";

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    application.useLogger(new ProxyLogger());
    useContainer(application.select(AppModule), { fallback: true, fallbackOnErrors: true });
    AxiosMock.mock(application.get(HttpService).axiosRef as AxiosInstance);

    const config: RabbitMqConfig = application.get(RabbitMqConfig);
    const queueNames: string[] = config.getQueuesNames();
    for (const queue of queueNames) {

      const provider: string = ProviderNameTransformer.transform(queue);
      const server: Consumer = application.get(provider);

      application.connectMicroservice(
      {
        strategy: server,
      });
    }
  }
}
