import { Injectable } from '@nestjs/common';

import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { ConsumerEventsEnum, SubscriptionExportProducer, BusinessModel, IntegrationSubscriptionModel } from '@pe/third-party-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class SubscriptionMessagesMock extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(ConsumerEventsEnum.IntegrationExported)
  public async mockSubscriptionExportProducer(): Promise<void> {

    const businessModel: BusinessModel = {
      id: BUSINESS_ID,
    } as BusinessModel;

    const integrationSubscriptionModel: IntegrationSubscriptionModel = {
      business: businessModel,
    } as IntegrationSubscriptionModel;

    const producer: SubscriptionExportProducer =
      await this.getProvider<SubscriptionExportProducer>(SubscriptionExportProducer);

    await producer.export(
      integrationSubscriptionModel,
      businessModel,
    )
  }
}
