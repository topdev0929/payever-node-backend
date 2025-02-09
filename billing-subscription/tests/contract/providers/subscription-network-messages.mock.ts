import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { v4 } from 'uuid';
import { SubscriptionNetworkRabbitMessagesEnum } from '../../../src/subscriptions/enums';
import { SubscriptionNetworkModel } from '../../../src/subscriptions/models';
import { SubscriptionsMessagesProducer } from '../../../src/subscriptions/producers';
const BUSINESS_ID: string = v4();
const SUBSCRIPTION_NETWORK_ID: string = v4();
const FAKE_SUBSCRIPTION_NETWORK: SubscriptionNetworkModel = {
  business: BUSINESS_ID,
  favicon: 'favicon',
  id: SUBSCRIPTION_NETWORK_ID,
  isDefault: true,
  logo: 'logo',
  name: 'subscription network name',
} as SubscriptionNetworkModel;

@Injectable()
export class SubscriptionNetworkMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkCreated)
  public async mockSubscriptionNetworkCreated(): Promise<void> {
    const producer: SubscriptionsMessagesProducer = await this.getProvider<SubscriptionsMessagesProducer>(
      SubscriptionsMessagesProducer,
    );
    await producer.produceRpcSubscriptionNetworkMessage(
      SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkCreated,
      FAKE_SUBSCRIPTION_NETWORK,
    );
  }

  @PactRabbitMqMessageProvider(SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkUpdated)
  public async mockSubscriptionNetworkUpdated(): Promise<void> {
    const producer: SubscriptionsMessagesProducer = await this.getProvider<SubscriptionsMessagesProducer>(
      SubscriptionsMessagesProducer,
    );
    await producer.produceRpcSubscriptionNetworkMessage(
      SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkUpdated,
      FAKE_SUBSCRIPTION_NETWORK,
    );
  }

  @PactRabbitMqMessageProvider(SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkRemoved)
  public async mockSubscriptionNetworkRemoved(): Promise<void> {
    const producer: SubscriptionsMessagesProducer = await this.getProvider<SubscriptionsMessagesProducer>(
      SubscriptionsMessagesProducer,
    );
    await producer.produceRpcSubscriptionNetworkMessage(
      SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkRemoved,
      FAKE_SUBSCRIPTION_NETWORK,
    );
  }
}
