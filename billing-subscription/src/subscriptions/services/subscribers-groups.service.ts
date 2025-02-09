import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  UpdateQuery,
  FilterQuery,
  DocumentDefinition,
  Query,
} from 'mongoose';

import { SubscribersGroupSchemaName } from '../schemas';
import { SubscribersGroupModel } from '../models/subscribers-group.model';

@Injectable()
export class CustomerGroupsService {
  constructor(
    @InjectModel(SubscribersGroupSchemaName)
      private readonly subscribersGroup: Model<SubscribersGroupModel>,
    ) { }

  public async create(
    data: DocumentDefinition<SubscribersGroupModel>,
  ): Promise<SubscribersGroupModel> {

    const existing: SubscribersGroupModel = await this.subscribersGroup.findById(data._id);
    if (existing) {
      return this.update(data);
    }


    return this.subscribersGroup.create(data);
  }

  public find(
    filter: FilterQuery<SubscribersGroupModel>,
  ): Query<SubscribersGroupModel[], SubscribersGroupModel> {
    return this.subscribersGroup.find(filter);
  }

  public async update(
    data: UpdateQuery<SubscribersGroupModel>,
  ): Promise<SubscribersGroupModel> {
    return this.subscribersGroup.findByIdAndUpdate(
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
  ): Promise<SubscribersGroupModel> {
    return this.subscribersGroup.findByIdAndDelete(groupId);
  }
}
