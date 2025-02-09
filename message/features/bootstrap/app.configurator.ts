import { HttpService, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { AxiosInstance } from 'axios';

import { Consumer, RabbitMqConfig, ProviderNameTransformer } from '@pe/nest-kit';
import * as cors from 'cors';
import { environment } from '../../src/environments';

environment.debounceEvents.wait = 1;
environment.debounceEvents.maxWait = 2;

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe({ transform: true }));
    application.setGlobalPrefix('/api');
    AxiosMock.mock(application.get(HttpService).axiosRef as AxiosInstance);
    application.use(cors());

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

