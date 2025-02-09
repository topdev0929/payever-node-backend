import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubscriptionDto } from '../dto';
import { BusinessData } from '../interfaces';
import { SubscriptionModel } from '../models';
import { SubscriptionSchemaName } from '../schemas';


@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(SubscriptionSchemaName)
      private readonly subsciptionModel: Model<SubscriptionModel>,
  ) { }

  public async findById(id: string): Promise<SubscriptionModel> {
    return this.subsciptionModel.findOne( { _id: id } );
  }

  public async createSubscription(createSubscription: SubscriptionDto): Promise<SubscriptionModel> {
    return this.subsciptionModel.create({
      _id: createSubscription._id,
      businessId: createSubscription.plan.businessId,
    });      
  }

  public async deleteSubscription(id: string): Promise<SubscriptionModel> {
    return this.subsciptionModel.findOneAndUpdate(
      { _id: id }, 
      { 
        $set: { subscribed: false },
      },
    );
  }

  public async getBusinessStatistics(businessId: string, from : Date): Promise<BusinessData> {
    const totalQuery: any = {
      businessId,
    };

    const subscribed: any = {
      businessId,
      subscribed: true,
      updatedAt: { $gte: from },
    };

    const unsubscribed: any = {
      businessId,
      subscribed: false,
      updatedAt: { $gte: from },
    };

    return {
      subscribed: await this.subsciptionModel.count(totalQuery).exec(),
      total:  await this.subsciptionModel.count(subscribed).exec(),
      unsubscribed:  await this.subsciptionModel.count(unsubscribed).exec(),
    };
  }

}
