import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { v4 } from 'uuid';
import { PlanTypeEnum, SubscriptionRabbitMessagesEnum } from '../../../src/subscriptions/enums';
import { SubscriptionPlanModel } from '../../../src/subscriptions/models';
import { SubscriptionPlanMessagesProducer } from '../../../src/subscriptions/producers';
const BUSINESS_ID: string = v4();
const SUBSCRIPTION_PLAN_ID: string = v4();
const FAKE_SUBSCRIPTION_PLAN: SubscriptionPlanModel = {
  toObject: (): any => {
    return {
      _id: SUBSCRIPTION_PLAN_ID,
      business: {
        id: BUSINESS_ID,
      },
      name: 'Subscription Plan Name',
      planType: PlanTypeEnum.fixed,
    };
  },

  _id: SUBSCRIPTION_PLAN_ID,
  name: 'Subscription Plan Name',
  businessId: BUSINESS_ID,
} as SubscriptionPlanModel;

@Injectable()
export class SubscriptionPlanMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(SubscriptionRabbitMessagesEnum.SubscriptionCreated)
  public async mockSubscriptionPlanCreated(): Promise<void> {
    const producer: SubscriptionPlanMessagesProducer =
      await this.getProvider<SubscriptionPlanMessagesProducer>(SubscriptionPlanMessagesProducer);
    await producer.produceSubscriptionMessage(SubscriptionRabbitMessagesEnum.SubscriptionCreated,
      FAKE_SUBSCRIPTION_PLAN);
  }

  @PactRabbitMqMessageProvider(SubscriptionRabbitMessagesEnum.SubscriptionUpdated)
  public async mockSubscriptionPlanUpdated(): Promise<void> {
    const producer: SubscriptionPlanMessagesProducer =
      await this.getProvider<SubscriptionPlanMessagesProducer>(SubscriptionPlanMessagesProducer);
    await producer.produceSubscriptionMessage(SubscriptionRabbitMessagesEnum.SubscriptionUpdated,
      FAKE_SUBSCRIPTION_PLAN);
  }

  @PactRabbitMqMessageProvider(SubscriptionRabbitMessagesEnum.SubscriptionRemoved)
  public async mockSubscriptionPlanRemoved(): Promise<void> {
    const producer: SubscriptionPlanMessagesProducer =
      await this.getProvider<SubscriptionPlanMessagesProducer>(SubscriptionPlanMessagesProducer);
    await producer.produceSubscriptionMessage(SubscriptionRabbitMessagesEnum.SubscriptionRemoved,
      FAKE_SUBSCRIPTION_PLAN);
  }

  @PactRabbitMqMessageProvider(SubscriptionRabbitMessagesEnum.SubscriptionExport)
  public async mockSubscriptionPlanExported(): Promise<void> {
    const producer: SubscriptionPlanMessagesProducer =
      await this.getProvider<SubscriptionPlanMessagesProducer>(SubscriptionPlanMessagesProducer);
    await producer.produceSubscriptionMessage(SubscriptionRabbitMessagesEnum.SubscriptionExport,
      FAKE_SUBSCRIPTION_PLAN);
  }
}
