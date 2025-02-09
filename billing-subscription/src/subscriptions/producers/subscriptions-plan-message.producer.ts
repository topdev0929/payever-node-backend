import { Injectable, Logger } from '@nestjs/common';

import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';
import { SubscriptionRabbitMessagesEnum } from '../enums';
import { SubscriptionPlanModel } from '../models';

@Injectable()
export class SubscriptionPlanMessagesProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  public async produceSubscriptionMessage(
    eventName: SubscriptionRabbitMessagesEnum,
    subscriptionPlan: SubscriptionPlanModel,
  ): Promise<void> {
    if (!subscriptionPlan) {
      return;
    }

    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          ...subscriptionPlan.toObject(),
          business: {
            id: subscriptionPlan.businessId,
          },
          id: subscriptionPlan._id,
        },
      },
    );
  }
}
