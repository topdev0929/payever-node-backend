import { INestApplication, ValidationPipe, HttpService } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { Consumer, RabbitMqConfig, ProviderNameTransformer } from '@pe/nest-kit';
import { AxiosInstance } from 'axios';
import * as cors from 'cors';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe());
    application.setGlobalPrefix('/api');
    application.use(cors());
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
