import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { Consumer, RabbitMqConfig, ProviderNameTransformer } from '@pe/nest-kit';
import * as cors from 'cors';

export class AppConfigurator implements AppConfiguratorInterface {
  public async setup(application: INestApplication): Promise<void> {
    application.useGlobalPipes(new ValidationPipe());
    application.setGlobalPrefix('/api');

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

