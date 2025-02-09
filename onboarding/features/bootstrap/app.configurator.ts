import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ProxyLogger } from '@pe/cucumber-sdk';
import { Consumer, ProviderNameTransformer, RabbitMqConfig } from '@pe/nest-kit';
import fastifyMultipart from 'fastify-multipart';
import { environment } from '../../src/environments';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    await application.getHttpAdapter().getInstance().register(fastifyMultipart);
    application.useLogger(new ProxyLogger());
    application.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true, whitelist: true }));
    application.setGlobalPrefix('/api');

    const config: RabbitMqConfig = application.get(RabbitMqConfig);
    const queueNames: string[] = config.getQueuesNames();
    for (const queueName of queueNames) {
      const consumerName: string = ProviderNameTransformer.transform(queueName);
      const server: Consumer = application.get(consumerName);
      application.connectMicroservice({
        strategy: server,
      });
    }
    environment.processorDelayMs = 1;
  }
}
