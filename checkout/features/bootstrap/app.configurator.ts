import { INestApplication, ValidationPipe, HttpService } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { Consumer, ProviderNameTransformer, RabbitMqConfig } from '@pe/nest-kit';
import * as cors from 'cors';
import fastifyMultipart from 'fastify-multipart';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { ProxyLogger } from '@pe/cucumber-sdk';
import { AxiosInstance } from 'axios';

export class AppConfigurator implements AppConfiguratorInterface {
  public async setup(application: INestApplication): Promise<void> {
    await application.getHttpAdapter().getInstance().register(fastifyMultipart);
    application.useLogger(new ProxyLogger());

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
