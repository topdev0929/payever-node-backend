import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventListener } from '@pe/nest-kit';
import { SubscriptionEventsEnum } from '../enums';
import { SubscriptionModel } from '../models';
import { SubscriptionElasticService } from '../services';
import { SubscriptionSchemaName } from '../schemas';

@Injectable()
export class SubscriptionEventsListener {
  constructor(
    @InjectModel(SubscriptionSchemaName) private readonly subscriptionsModel: Model<SubscriptionModel>,
    private readonly subscriptionElasticService: SubscriptionElasticService,
  ) { }

  @EventListener(SubscriptionEventsEnum.SubscriptionCreated)
  public async onBillingSubscriptionCreated(billingSubscription: SubscriptionModel): Promise<void> {
    // This is because plan.business is used in spotlight for search based on business
    const instance: SubscriptionModel =
      await this.subscriptionsModel.findById(billingSubscription._id).populate('plan');


    await this.subscriptionElasticService.saveIndex(instance);
  }

  @EventListener(SubscriptionEventsEnum.SubscriptionDeleted)
  public async onBillingSubscriptionDeleted(billingSubscription: SubscriptionModel): Promise<void> {

    await this.subscriptionElasticService.deleteIndex(billingSubscription);
  }
}
