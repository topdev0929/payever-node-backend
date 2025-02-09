import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  UpdateQuery,
  FilterQuery,
  DocumentDefinition,
  Query,
} from 'mongoose';
import { CustomerPlanModel } from '../models/customer-plan.model';
import { PlanCustomerSchemaName } from '../schemas';

@Injectable()
export class CustomerPlanService {
  constructor(
    @InjectModel(PlanCustomerSchemaName) private readonly customerPlan: Model<CustomerPlanModel>,
  ) { }

  public async create(
    data: DocumentDefinition<CustomerPlanModel>,
  ): Promise<CustomerPlanModel> {
    const existing: CustomerPlanModel = await this.customerPlan.findById(data._id);
    if (existing) {
      return this.update(data);
    }

    return this.customerPlan.create(data);
  }

  public find(
    filter: FilterQuery<CustomerPlanModel>,
  ): Query<CustomerPlanModel[], CustomerPlanModel> {
    return this.customerPlan.find(filter);
  }

  public async update(
    data: UpdateQuery<CustomerPlanModel>,
  ): Promise<CustomerPlanModel> {
    return this.customerPlan.findByIdAndUpdate(
      { _id: data._id },
      { $set: data },
      { upsert: true, new: true },
    );
  }

  public async delete(
    customerPlanId: string,
  ): Promise<CustomerPlanModel> {
    return this.customerPlan.findByIdAndDelete(customerPlanId);
  }
}
