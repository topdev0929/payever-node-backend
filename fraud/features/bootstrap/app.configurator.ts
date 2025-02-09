import { HttpService, INestApplication, ValidationPipe } from '@nestjs/common';
import { ProxyLogger } from '@pe/cucumber-sdk';
import { AxiosMock } from '@pe/cucumber-sdk/module/axios';
import { RABBITMQ_SERVER, ValidationPipeObject } from '@pe/nest-kit';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.useLogger(new ProxyLogger());
    application.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ forbidNonWhitelisted: false })));
    application.setGlobalPrefix('/api');
    AxiosMock.mock(application.get(HttpService).axiosRef);

    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
