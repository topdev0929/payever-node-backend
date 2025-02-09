import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model, UpdateQuery } from 'mongoose';
import { BaseModelService } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { ChannelSetSchemaName } from '../schemas';
import { ChannelSetInterface } from '../interfaces';
import { ChannelSetModel } from '../models';
import { Mutex } from '@pe/nest-kit/modules/mutex';

const mutexKey: string = 'product-channel-set';

@Injectable()
export class ChannelSetService extends BaseModelService<ChannelSetModel> {
  constructor(
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
    private readonly mutex: Mutex,
  ) {
    super(channelSetModel);
  }

  public async findOneUpdateOrUpsert(id: string, data: any): Promise<void> {
    await this.mutex.lock(
      mutexKey,
      id,
      async () => this.channelSetModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: data,
        },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        },
      ),
    );
  }

  public async findOneById(id: string): Promise<ChannelSetModel> {
    return this.channelSetModel.findById(id);
  }

  public async findByIds(ids: string[]): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find(
      {
        _id : { $in : ids },
      },
    );
  }

  public async findByTypeAndBusiness(type: string, business: BusinessModel): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({
      businessId: business.id,
      type: type,
    });
  }

  public async findByType(type: string): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({
      type: type,
    });
  }

  public async findByBusinessId(businessId: string): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({
      businessId: businessId,
    });
  }

  public async deleteByBusiness(business: BusinessModel): Promise<void> {
    this.channelSetModel.remove({
      businessId: business.id,
    });
  }

  public async deleteOneById(id: string): Promise<void> {
    await this.channelSetModel.deleteOne({ _id: id });
  }

  /**
   * @deprecated
   */
  public async createOrUpdateById(id: string, data: ChannelSetInterface): Promise<ChannelSetModel> {
    let result: ChannelSetModel;

    try {
      result = await this.channelSetModel.create({
        _id: id,
        ...data,
      });
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        delete data.businessId;
        delete data.type;
        delete data.originalId;

        result = await this.channelSetModel.findOneAndUpdate(
          { _id: id },
          { $set: data },
          { new: true },
        );
      } else {
        throw err;
      }
    }

    return result;
  }

  public async findOrCreate(id: string, businessId: string, data: ChannelSetInterface): Promise<ChannelSetModel> {
    let channelSet: ChannelSetModel = await this.channelSetModel.findById(id);
    if (!channelSet) {
      data.businessId = businessId;
      if (!id) {
        channelSet = await this.channelSetModel.findOne({
          business: businessId,
          type: data.type,
        });
      } else {
        channelSet = await this.createOrUpdateById(id, data);
      }
    }

    return channelSet;
  }
}
