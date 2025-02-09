import { HttpService, INestApplication, ValidationPipe } from '@nestjs/common';
import { ProxyLogger } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { Consumer, ValidationPipeObject } from '@pe/nest-kit';
import { ProviderNameTransformer } from '@pe/nest-kit/modules/rabbit-mq';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.useLogger(new ProxyLogger());
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    application.setGlobalPrefix('/api');
    AxiosMock.mock(application.get(HttpService).axiosRef);
    const provider: string = ProviderNameTransformer.transform(`async_events_billing_subscription_micro`);
    const server: Consumer = application.get(provider);
    application.connectMicroservice({ strategy: server });
  }
}
