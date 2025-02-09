import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query, UpdateQuery } from 'mongoose';
import { CustomerSubscriptionPlanModel } from '../models/customer-subscription-plan.model';
import { PlanCustomerSubscriptionSchemaName } from '../schemas';

@Injectable()
export class CustomerSubscriptionPlanService {
  constructor(
    @InjectModel(PlanCustomerSubscriptionSchemaName)
      private readonly customerSubscriptionPlan: Model<CustomerSubscriptionPlanModel>,
  ) { }

  public async create(
    data: CustomerSubscriptionPlanModel,
  ): Promise<CustomerSubscriptionPlanModel> {
    return this.customerSubscriptionPlan.create(data);
  }

  public find(
    filter: FilterQuery<CustomerSubscriptionPlanModel>,
  ): Query<CustomerSubscriptionPlanModel[], CustomerSubscriptionPlanModel> {
    return this.customerSubscriptionPlan.find(filter);
  }

  public async findPopulated(
    filter: FilterQuery<CustomerSubscriptionPlanModel>,
  ): Promise<CustomerSubscriptionPlanModel[]> {
    return this.customerSubscriptionPlan.find(filter)
        .populate('customer')
        .populate('plan')
        .populate('subscribersGroups')
        .populate('plansGroup') as any;
  }

  public async update(
    data: UpdateQuery<CustomerSubscriptionPlanModel>,
  ): Promise<CustomerSubscriptionPlanModel> {
    return this.customerSubscriptionPlan.findByIdAndUpdate(
      { _id: data._id },
      {
        $set: data,
      },
      { upsert: true, new: true },
    );
  }

  public async delete(planId: string): Promise<void> {    
    await this.customerSubscriptionPlan.findByIdAndDelete(planId);
  }
}
