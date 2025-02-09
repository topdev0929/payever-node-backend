import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubscriptionSchemaName } from '../schemas';
import { ConnectionPlanModel, ProductModel, SubscriptionPlanModel } from '../models';
import { SubscriptionModel } from '../models/subscription.model';
import { ProductInterface, ProductConnectionPlanInterface } from '../interfaces/subscriptions';

@Injectable()
export class SubscriptionsDataExtractor {
  constructor(
    @InjectModel(SubscriptionSchemaName) private readonly subscriptionsModel: Model<SubscriptionModel>,
  ) { }

  public async getData(userId: string): Promise<string> {
    const subscriptions: SubscriptionModel[] = await this.subscriptionsModel
      .find({ userId})
      .populate({ path: 'plan', populate: { path: 'subscriptionPlan', populate: 'products'}});
    const result: ProductInterface[] = [];

    for (const subscription of subscriptions) {
      const subscriptionPlan: SubscriptionPlanModel = (subscription?.plan as ConnectionPlanModel)?.subscriptionPlan;

      if (subscriptionPlan.products.length === 0) {
        continue;
      }

      for (const subProduct of subscriptionPlan.products) {
        let product: ProductInterface = result.find(
          (_product: ProductInterface) => (subProduct as ProductModel)._id,
        );
  
        if (!product) {
          product = { id: (subProduct as ProductModel)._id, plans: []};
          result.push(product);
        }
  
        let plan: ProductConnectionPlanInterface
          = product.plans.find(
            (_plan: ProductConnectionPlanInterface) =>
             _plan.id === (subscription.plan as ConnectionPlanModel).id);
        if (!plan) {
          plan = { id: (subscription.plan as ConnectionPlanModel).id, subscriptions: [] } as any;
          product.plans.push(plan);
        }
  
        const subscriptionExists: boolean = plan.subscriptions.some(
          (_subscription: SubscriptionModel) => subscription._id === _subscription._id,
        );
        if (!subscriptionExists) {
          plan.subscriptions.push(subscription.toObject() as SubscriptionModel);
        }
      }

    }

    return JSON.stringify(result);
  }
}
