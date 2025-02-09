import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { RemoteSubscriptionConverter } from '../converters';
import { RemoteSubscriptionDto, SubscriptionQueryDto, TransactionRmqMessageDto } from '../dto';
import { ConnectionPlanModel, SubscriptionModel } from '../models';
import { SubscriptionSchemaName } from '../schemas';
import { ConnectionPlans } from './connection-plans.service';
import { ThirdParty } from './third-party.service';
import { SubscriptionEventsEnum } from '../enums';

@Injectable()
export class Subscriptions {
  constructor(
    @InjectModel(SubscriptionSchemaName) private readonly subscriptionsModel: Model<SubscriptionModel>,
    private readonly connectionPlansService: ConnectionPlans,
    private readonly thirdPartyService: ThirdParty,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async saveSubscriptionsFromTransaction(transaction: TransactionRmqMessageDto): Promise<void> {
    const subscriptions: RemoteSubscriptionDto[] = RemoteSubscriptionConverter.listFromTransaction(transaction);

    for (const subscription of subscriptions) {
      const plan: ConnectionPlanModel = await this.connectionPlansService.getById(subscription.subscriptionPlanId);

      if (!plan) {
        this.logger.warn(
          `ConnectionPlan with remote id "${subscription.subscriptionPlanId}" ` +
            `not found for business "${subscription.businessId}"`,
        );
      }

      const newSub: SubscriptionModel = await this.subscriptionsModel.create({
        customerEmail: subscription.customerEmail,
        customerName: subscription.customerName,
        plan: plan.id,
        reference: subscription.reference,
        remoteSubscriptionId: subscription.id,
        transactionUuid: subscription.transactionUuid,
        userId: subscription.userId,
      } as SubscriptionModel);

      await this.eventDispatcher.dispatch(SubscriptionEventsEnum.SubscriptionCreated, newSub);
    }
  }

  public async unsubscribe(subscription: SubscriptionModel): Promise<SubscriptionModel> {    
    await subscription
      .populate('plan')
      .execPopulate();
      
    await (subscription
      .plan as ConnectionPlanModel)
      .populate('business')
      .populate('connection')
      .execPopulate();

      

    await this.thirdPartyService.unsubscribe(subscription, (subscription.plan as ConnectionPlanModel).business);

    
    const deletedSub: SubscriptionModel = await this.subscriptionsModel.findOneAndDelete({ _id: subscription.id });

    await this.eventDispatcher.dispatch(SubscriptionEventsEnum.SubscriptionDeleted, subscription);

    return deletedSub;
  }

  public async stopSubscriptionsByPlan(plan: ConnectionPlanModel): Promise<void> {
    const subscriptions: SubscriptionModel[] = await this.subscriptionsModel.find({
      $and: [
        { remoteSubscriptionId: { $exists: true } },
        { remoteSubscriptionId: { $ne: null } },
      ],
      plan: plan.id,
    });
    if (!subscriptions.length) {
      return;
    }

    await plan.populate('business').execPopulate();
    await this.thirdPartyService.unsubscribeMany(subscriptions, plan.connection, plan.business);

    await this.subscriptionsModel.deleteMany({
      _id: {
        $in: subscriptions.map((subscription: SubscriptionModel) => subscription.id),
      },
    });
  }

  public async getListByBusiness(business: BusinessModel): Promise<SubscriptionModel[]> {
    const conenctionPlans: ConnectionPlanModel[] = await this.connectionPlansService.getByBusiness(business);

    if (!conenctionPlans.length) {
      return [];
    }

    return this.subscriptionsModel
      .find({
        plan: {
          $in: conenctionPlans,
        },
      })
      .populate('plan');
  }


  public async getForAdmin(query: SubscriptionQueryDto)
    : Promise<{ documents: SubscriptionModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.planIds) {
      conditions.plan = { $in: query.planIds };
    }

    const documents: SubscriptionModel[] = await this.subscriptionsModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.subscriptionsModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }
}
