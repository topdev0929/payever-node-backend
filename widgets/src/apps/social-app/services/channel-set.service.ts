import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../models';
import { ChannelSetSchemaName } from '../schemas';

@Injectable()
export class ChannelSetService {
  constructor(
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
  ) { }

  public async create(channelSet: ChannelSetModel): Promise<ChannelSetModel> {

    return this.channelSetModel.create(channelSet);
  }

  public async remove(id: string): Promise<any> {

    return this.channelSetModel.remove({ _id: id });
  }

  public async findOneById(id: string): Promise<ChannelSetModel> {

    return this.channelSetModel.findOne({ _id: id });
  }

  public async deleteAllByBusiness(businessId: string): Promise<void> {
    await this.channelSetModel.deleteMany({ businessId }).exec();
  }

  public async findAllByBusiness(businessId: string): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({ businessId });
  }
}
