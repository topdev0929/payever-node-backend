import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { ValidationPipeObject, RabbitMqConfig, ProviderNameTransformer, Consumer } from '@pe/nest-kit';
import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.setGlobalPrefix('/api');
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ forbidNonWhitelisted: false })));
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
    useContainer(application.select(ApplicationModule), { fallback: true, fallbackOnErrors: true });
  }
}
