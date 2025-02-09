import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialPostModel } from '../models';
import { SocialPostSchemaName } from '../schemas';

@Injectable()
export class SocialPostService {
  constructor(
    @InjectModel(SocialPostSchemaName) private readonly postModel: Model<SocialPostModel>,
  ) { }

  public async upsert(data: any): Promise<SocialPostModel> {
    const set: any = { ...data };
    delete set._id;

    return this.postModel.findOneAndUpdate(
      { _id: data._id },
      { $set: set },
      {
        upsert: true,
        new: true,
      }
    );
  }

  public async remove(id: string): Promise<any> {
    return this.postModel.remove({ _id: id });
  }

  public async findAllByBusiness(businessId: string): Promise<SocialPostModel[]> {
    return this.postModel.find({ businessId });
  }
}
