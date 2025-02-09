import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import {
  AppEventsEnum,
  AppSubscriptionEventsEnum,
  EventSubscriptionEventsEnum,
  MessageBusEventsEnum,
} from '../enums';

type EventsEnum =
  AppEventsEnum |
  AppSubscriptionEventsEnum |
  EventSubscriptionEventsEnum |
  MessageBusEventsEnum;

@Injectable()
export class BaseEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async sendEvent(
    eventName: EventsEnum,
    payload: { },
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }
}
