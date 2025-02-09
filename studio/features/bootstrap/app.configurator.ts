import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Consumer } from '@pe/nest-kit';
import { ProviderNameTransformer } from '@pe/nest-kit/modules/rabbit-mq';

import { RABBITMQ_SERVER, ValidationPipeObject } from '@pe/nest-kit';
import { AppConfiguratorInterface, ProxyLogger } from '@pe/cucumber-sdk';
import { AppModule } from '../../src/app.module';

export class AppConfigurator implements AppConfiguratorInterface {
  public setup(application: INestApplication): void {
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    application.setGlobalPrefix('/api');
    application.useLogger(new ProxyLogger());

    const provider: string = ProviderNameTransformer.transform(`async_events_studio_micro`);
    const server: Consumer = application.get(provider);
    application.connectMicroservice({ strategy: server });

    useContainer(application.select(AppModule), { fallback: true, fallbackOnErrors: true });
  }
}
