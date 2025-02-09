import { Global, Injectable } from '@nestjs/common';

import { EventSubscriptionEventsEnum } from '../enums';
import { EventSubscriptionModel } from '../models';
import { BaseEventsProducer } from './base-events.producer';

@Global()
@Injectable()
export class EventSubscriptionEventsProducer extends BaseEventsProducer {
  public async eventSubscriptionUpdatedEvent(
    eventSubscription: EventSubscriptionModel,
  ): Promise<void> {
    await this.sendEvent(
      EventSubscriptionEventsEnum.eventSubscriptionUpdated,
      {
        ...eventSubscription.toObject(),
        app: {
          _id: eventSubscription.appId,
        },
        business: {
          _id: eventSubscription.businessId,
        },
      },
    );
  }
}
