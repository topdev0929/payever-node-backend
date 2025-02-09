import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { AppRegistryEventNameEnum } from '../../../src/environments/rabbitmq.enum';
import { AppsEventsProducer } from '../../../src/apps/producers/apps-events.producer';
import { BusinessModel } from '../../../src/models/business.model';
import { InstalledApp } from '../../../src/models/interfaces/installed-app';

@Injectable()
export class AppsEventsMessagesMock extends AbstractMessageMock {
  private app: InstalledApp = {
    _id: uuid.v4(),
    app: 'My App',
    code: '1hsj232',
    installed: true,
    startAt: null,
    started: false,
  } as any;

  private business: BusinessModel = {
    _id: uuid.v4(),
    installedApps: [this.app],
  } as BusinessModel;

  @PactRabbitMqMessageProvider(AppRegistryEventNameEnum.ApplicationInstalled)
  public async mockAppInstalled(): Promise<void> {
    const producer: AppsEventsProducer = await this.getProvider<AppsEventsProducer>(AppsEventsProducer);
    await producer.produceAppInstalledEvent(this.app, this.business);
  }

  @PactRabbitMqMessageProvider(AppRegistryEventNameEnum.ApplicationUnInstalled)
  public async mockAppUninstalled(): Promise<void> {
    const producer: AppsEventsProducer = await this.getProvider<AppsEventsProducer>(AppsEventsProducer);
    await producer.produceAppUninstalledEvent(this.app, this.business);
  }
}
