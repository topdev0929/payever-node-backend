import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { MongooseModel as TransactionsModel } from '../../apps/transactions-app/enums';
import { ChannelSetDayAmountModel, ChannelSetMonthAmountModel } from '../../apps/transactions-app/models';
import { ChannelSetEventsEnum, MongooseModel } from '../enum';
import { ChannelSetModel } from '../models';

@Injectable()
export class ChannelSetService {

  constructor(
    @InjectModel(MongooseModel.ChannelSet)
    private readonly channelSetModel: Model<ChannelSetModel>,
    @InjectModel(TransactionsModel.ChannelSetDayAmount)
    private readonly dayAmountModel: Model<ChannelSetDayAmountModel>,
    @InjectModel(TransactionsModel.ChannelSetMonthAmount)
    private readonly monthAmountModel: Model<ChannelSetMonthAmountModel>,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async changeActiveChannelSet(
    business: BusinessModel,
    channelSetId: string,
    channelSetType: string,
  ): Promise<void> {
    const channelSetList: ChannelSetModel[] = await this.findByBusiness(business);
    
    for (const channelSet of channelSetList) {
      if (channelSet.type === channelSetType) {
        if (channelSet._id === channelSetId) {
          channelSet.set({ active: true });
        } else {
          channelSet.set({ active: false });
        }

        await channelSet.save();
      }
    }
  }

  public async findOneById(id: string): Promise<ChannelSetModel> {
    return this.channelSetModel.findById(id);
  }

  public async findByBusiness(business: BusinessModel): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({ business: business });
  }

  public async create(
    id: string,
    data: { business: BusinessModel; type: string; currency: string },
  ): Promise<ChannelSetModel> {
    return this.channelSetModel.create(
      {
        _id: id,
        ...data,
        businessId: data.business._id,
      },
    );
  }

  public async update(id: string, data: { }): Promise<ChannelSetModel> {
    const updatedData: any = { };
    Object.keys(data).forEach((key: string) => {
      updatedData[`${key}`] = data[key];
    });

    try {
      return await this.channelSetModel.findOneAndUpdate(
        { _id: id },
        { $set: updatedData },
        { upsert: true, new: true },
      ).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    const channelSets: ChannelSetModel[] = await this.findByBusiness(business);
    for (const channelSet of channelSets) {
      await this.channelSetModel.deleteOne({ _id: channelSet.id }).exec();
      await this.dispatcher.dispatch(ChannelSetEventsEnum.ChannelSetRemoved, channelSet);
    }
  }
}
