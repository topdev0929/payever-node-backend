import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import {
  SubscriptionNetworkEventsEnum,
  SubscriptionNetworkRabbitMessagesEnum,
  SubscriptionRabbitMessagesEnum } from '../enums';
import { SubscriptionNetworkModel } from '../models';
import { SubscriptionsMessagesProducer } from '../producers';
import { AccessConfigService } from '../services';

@Injectable()
export class SubscriptionNetworkEventsListener {
  constructor(
    private readonly subscriptionsMessagesProducer: SubscriptionsMessagesProducer,
    private readonly accessConfigService: AccessConfigService,
  ) { }

  @EventListener(SubscriptionNetworkEventsEnum.SubscriptionNetworkCreated)
  public async onBillingSubscriptionNetworkCreated(subscriptionNetwork: SubscriptionNetworkModel): Promise<void> {
    await this.accessConfigService.createOrUpdate(
      subscriptionNetwork,
      {
        isLive: false,
      },
    );

    await this.subscriptionsMessagesProducer.produceSubscriptionNetworkEvent(
      SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkCreated,
      subscriptionNetwork,
    );
  }

  @EventListener(SubscriptionNetworkEventsEnum.SubscriptionNetworkRemoved)
  public async onBillingSubscriptionNetworkDeleted(subscriptionNetwork: SubscriptionNetworkModel): Promise<void> {
    await this.subscriptionsMessagesProducer.produceSubscriptionNetworkEvent(
      SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkRemoved,
      subscriptionNetwork,
    );
  }

  @EventListener(SubscriptionNetworkEventsEnum.SubscriptionNetworkUpdated)
  public async onBillingSubscriptionNetworkUpdated(subscriptionNetwork: SubscriptionNetworkModel): Promise<void> {
    await this.subscriptionsMessagesProducer.produceSubscriptionNetworkEvent(
      SubscriptionNetworkRabbitMessagesEnum.SubscriptionNetworkUpdated,
      subscriptionNetwork,
    );
  }
}
