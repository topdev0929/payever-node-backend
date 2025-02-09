import { HttpService, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import multipart from '@fastify/multipart';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { Consumer, RabbitMqConfig, ProviderNameTransformer } from '@pe/nest-kit';
import * as cors from 'cors';
import { useContainer } from 'class-validator';
import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator implements AppConfiguratorInterface {
  public async setup(application: INestApplication): Promise<void> {
    application.useGlobalPipes(new ValidationPipe());
    application.use(cors());
	await application
	.getHttpAdapter()
	.getInstance()
	.register(multipart, { attachFieldsToBody: true });

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
