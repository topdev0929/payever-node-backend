import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { SubscriptionPlanEventsEnum, SubscriptionRabbitMessagesEnum } from '../enums';
import { SubscriptionPlanModel } from '../models';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { SubscriptionPlanMessagesProducer } from '../producers';

@Injectable()
export class SubscriptionPlanEventsListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private readonly subscriptionPlanMessagesProducer: SubscriptionPlanMessagesProducer,
  ) { }

  @EventListener(SubscriptionPlanEventsEnum.SubscriptionPlanCreated)
  public async onBillingSubscriptionPlanCreated(subscriptionPlan: SubscriptionPlanModel, extraData: {
    targetFolderId: string;
    elasticIds: any;
  }): Promise<void> {
    await this.subscriptionPlanMessagesProducer.produceSubscriptionMessage(
      SubscriptionRabbitMessagesEnum.SubscriptionCreated,
      subscriptionPlan,
    );

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, { 
      ...subscriptionPlan.toObject(),
      elasticIds: extraData?.elasticIds,
      parentFolderId: extraData?.targetFolderId,
    });
  }

  @EventListener(SubscriptionPlanEventsEnum.SubscriptionPlanDeleted)
  public async onBillingSubscriptionPlanDeleted(subscriptionPlan: SubscriptionPlanModel): Promise<void> {
    await this.subscriptionPlanMessagesProducer.produceSubscriptionMessage(
      SubscriptionRabbitMessagesEnum.SubscriptionRemoved,
      subscriptionPlan,
    );
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, subscriptionPlan._id);
  }

  @EventListener(SubscriptionPlanEventsEnum.SubscriptionPlanUpdated)
  public async onBillingSubscriptionPlanUpdated(subscriptionPlan: SubscriptionPlanModel): Promise<void> {
    await this.subscriptionPlanMessagesProducer.produceSubscriptionMessage(
      SubscriptionRabbitMessagesEnum.SubscriptionUpdated,
      subscriptionPlan,
    );
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, subscriptionPlan.toObject());
  }
}
