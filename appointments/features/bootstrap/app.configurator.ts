import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { Consumer, ProviderNameTransformer, RabbitMqConfig, RABBITMQ_SERVER, ValidationPipeObject } from '@pe/nest-kit';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    application.setGlobalPrefix('/api');

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
