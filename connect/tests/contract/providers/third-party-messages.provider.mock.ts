import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { EventProducer } from '../../../src/integration/producer';
import { IntegrationModel, IntegrationSubscriptionModel } from '../../../src/integration/models';
import { MessageBusEventsEnum } from '../../../src/integration/enum';
import * as uuid from 'uuid';
import { BusinessModelLocal } from '../../../src/business';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class ThirdPartyMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider('connect.event.third-party.enabled')
  public async mockThirdPartyEnabled(): Promise<void> {

    const businessModel: BusinessModelLocal = {
      id: BUSINESS_ID,
    } as BusinessModelLocal;

    const integrationModel: IntegrationModel = {
      category: 'test_category',
      name: 'some integration',
    } as IntegrationModel;

    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);

    await producer.sendThirdPartyEnabledDisabledMessage(
      businessModel,
      integrationModel,
      'connect.event.third-party.enabled',
    );
  }

  @PactRabbitMqMessageProvider('connect.event.third-party.disabled')
  // tslint:disable-next-line: no-identical-functions
  public async mockThirdPartyDisabled(): Promise<void> {

    const businessModel: BusinessModelLocal = {
      id: BUSINESS_ID,
    } as BusinessModelLocal;

    const integrationModel: IntegrationModel = {
      category: 'test_category',
      name: 'some integration',
    } as IntegrationModel;

    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);


    await producer.sendThirdPartyEnabledDisabledMessage(
      businessModel,
      integrationModel,
      'connect.event.third-party.disabled',
    );
  }

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.ThirdPartyExported)
  public async mockThirdPartyExported(): Promise<void> {
    const businessModel: BusinessModelLocal = {
      _id: BUSINESS_ID,
    } as BusinessModelLocal;

    const subscription: IntegrationSubscriptionModel = {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      installed: true,
      integration: {
        name: 'integration name',
      },
    } as IntegrationSubscriptionModel;

    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.exportSubscriptionsToProduct(subscription, businessModel);
  }

  @PactRabbitMqMessageProvider('connect.event.report-data.prepared')
  public async mockReportDataPrepared(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendReportDataPreparedMessage([
      {
        business: uuid.v4(),
      },
    ]);
  }
}
