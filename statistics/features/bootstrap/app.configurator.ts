import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { Consumer, RabbitMqConfig, ProviderNameTransformer } from '@pe/nest-kit';
import * as cors from 'cors';
import { useContainer } from 'class-validator';
import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator implements AppConfiguratorInterface {
  public async setup(application: INestApplication): Promise<void> {
    application.useGlobalPipes(new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }));

    application.use(cors());
    application.setGlobalPrefix('/api');

    useContainer(application.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });

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
