import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface, ProxyLogger } from '@pe/cucumber-sdk';
import { Consumer, RabbitMqConfig, ProviderNameTransformer } from '@pe/nest-kit';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    application.setGlobalPrefix('/api');
    application.useLogger(new ProxyLogger());
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
