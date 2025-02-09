import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupInterface } from '../interfaces';
import { GroupModel } from '../models';
import { GroupSchemaName } from '../schemas';

@Injectable()
export class GroupService {

  constructor(
    @InjectModel(GroupSchemaName) private readonly groupModel: Model<GroupModel>,
  ) { }

  public async createOrUpdateGroupFromEvent(data: any): Promise<GroupModel> {

    return this.groupModel.findOneAndUpdate(
      { _id: data._id },
      { $set: { ...data } },
      { new: true, upsert: true },
    );
  }

  public async deleteGroup(data: GroupInterface): Promise<void> {
    await this.groupModel.deleteOne({ _id: data._id }).exec();
  }

  public async count(businessId: string): Promise<number> {
    return this.groupModel.countDocuments( { businessId } );
  }

}
