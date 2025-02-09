import { HttpService, INestApplication, ValidationPipe } from '@nestjs/common';
import { ProxyLogger } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { Consumer, ProviderNameTransformer, RabbitMqConfig, ValidationPipeObject } from '@pe/nest-kit';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.useLogger(new ProxyLogger());
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    application.setGlobalPrefix('/api');
    AxiosMock.mock(application.get(HttpService).axiosRef);

    const config: RabbitMqConfig = application.get(RabbitMqConfig);
    const queueNames: string[] = config.getQueuesNames();

    for (const queue of queueNames) {
      const provider: string = ProviderNameTransformer.transform(queue);
      const server: Consumer = application.get(provider);

      application.connectMicroservice({
        strategy: server,
      });
    }
  }
}
