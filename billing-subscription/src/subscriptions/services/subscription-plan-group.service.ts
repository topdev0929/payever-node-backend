import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query } from 'mongoose';
import { SubscriptionPlansGroupSchemaName } from '../schemas';
import { SubscriptionPlansGroupModel } from '../models/subscription-plan-group.model';

@Injectable()
export class SubscriptionPlanGroupService {
  constructor(
    @InjectModel(SubscriptionPlansGroupSchemaName)
      private readonly planGroup: Model<SubscriptionPlansGroupModel>,
  ) { }

  public async create(
    data: SubscriptionPlansGroupModel,
  ): Promise<SubscriptionPlansGroupModel> {
    return this.planGroup.create(data);
  }

  public find(
    filter: FilterQuery<SubscriptionPlansGroupModel>,
  ): Query<SubscriptionPlansGroupModel[], SubscriptionPlansGroupModel> {
    return this.planGroup.find(filter);
  }

  public async update(
    data: SubscriptionPlansGroupModel,
  ): Promise<SubscriptionPlansGroupModel> {
    return this.planGroup.findByIdAndUpdate(
      data._id,
      {
        $set: data,
      },
      {
        new: true,
      });
  }

  public async delete(
    groupId: string,
  ): Promise<SubscriptionPlansGroupModel> {
    return this.planGroup.findByIdAndDelete(groupId);
  }
}
