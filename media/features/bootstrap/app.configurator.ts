import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as fastifyMultipart from '@fastify/multipart';
import { Consumer, ProviderNameTransformer } from '@pe/nest-kit';
import { environment } from '../../src/environments';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.setGlobalPrefix('/api');
    await application
      .getHttpAdapter()
      .getInstance()
      .register(fastifyMultipart);

    application.useGlobalPipes(new ValidationPipe({ transform: true }));

    for (const queue of environment.rabbitmq.exchanges[0].queues) {
      const queueName: string = queue.name;
      const consumerName: string = ProviderNameTransformer.transform(queueName);
      const server: Consumer = application.get(consumerName);

      application.connectMicroservice({
        strategy: server,
      });
    }
  }
}
