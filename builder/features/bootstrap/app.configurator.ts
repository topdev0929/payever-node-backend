import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Consumer, ProviderNameTransformer } from '@pe/nest-kit';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  override: true,
  path: path.resolve('./features/config/env'),
});

import { environment } from '../../src/environments';

export class AppConfigurator implements AppConfiguratorInterface {
  public async setup(application: INestApplication): Promise<void> {
    application.setGlobalPrefix('/api');
    application.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    const provider: string = ProviderNameTransformer.transform(environment.rabbitChannel);
    const server: Consumer = application.get(provider);
    application.connectMicroservice({ strategy: server });
  }
}
