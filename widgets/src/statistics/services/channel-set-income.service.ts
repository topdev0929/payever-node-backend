import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MongooseModel as TransactionsModel } from '../../apps/transactions-app/enums';
import { ChannelSetDayAmountModel, ChannelSetMonthAmountModel } from '../../apps/transactions-app/models';
import { MongooseModel } from '../enum';
import { ChannelSetModel } from '../models';
import { DateFormat } from '../tools/date-format';

@Injectable()
export class ChannelSetIncomeService {

  constructor(
    @InjectModel(MongooseModel.ChannelSet)
      private readonly channelSetModel: Model<ChannelSetModel>,
    @InjectModel(TransactionsModel.ChannelSetDayAmount)
      private readonly dayAmountModel: Model<ChannelSetDayAmountModel>,
    @InjectModel(TransactionsModel.ChannelSetMonthAmount)
      private readonly monthAmountModel: Model<ChannelSetMonthAmountModel>,
  ) { }

  public async add(channelSet: ChannelSetModel, date: Date, amount: number): Promise<void> {
    amount = Math.ceil(Number(amount) * 100) / 100;
    await this.addRevenue(channelSet, amount);
    await this.addDaily(channelSet, date, amount);
    await this.addMonthly(channelSet, date, amount);
  }

  public async subtract(channelSet: ChannelSetModel, date: Date, amount: number): Promise<void> {
    amount = Math.ceil(Number(amount) * 100) / 100;
    await this.subtractRevenue(channelSet, amount);
    await this.subtractDaily(channelSet, date, amount);
    await this.subtractMonthly(channelSet, date, amount);
  }

  public async addRevenue(channelSet: ChannelSetModel, amount: number): Promise<void> {
    await this.channelSetModel.updateOne(
      {
        _id: channelSet.id,
      },
      {
        $inc: {
          revenue: Number(amount),
          sells: 1,
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async addDaily(channelSet: ChannelSetModel, date: Date, amount: number): Promise<void> {
    await this.dayAmountModel.updateOne(
      {
        channelSet: channelSet.id,
        date: DateFormat.daily(date),
      },
      {
        $inc: {
          amount: Number(amount),
        },
        $set: {
          channelSet: channelSet.id,
          date: DateFormat.daily(date),
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async addMonthly(channelSet: ChannelSetModel, date: Date, amount: number): Promise<void> {
    await this.monthAmountModel.updateOne(
      {
        channelSet: channelSet.id,
        date: DateFormat.monthly(date),
      },
      {
        $inc: {
          amount: Number(amount),
        },
        $set: {
          channelSet: channelSet.id,
          date: DateFormat.monthly(date),
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async subtractRevenue(channelSet: ChannelSetModel, amount: number): Promise<void> {
    await this.channelSetModel.updateOne(
      {
        _id: channelSet.id,
      },
      {
        $inc: {
          revenue: - Number(amount),
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async subtractDaily(channelSet: ChannelSetModel, date: Date, amount: number): Promise<void> {
    await this.dayAmountModel.updateOne(
      {
        channelSet: channelSet.id,
        date: DateFormat.daily(date),
      },
      {
        $inc: {
          amount: - Number(amount),
        },
        $set: {
          channelSet: channelSet.id,
          date: DateFormat.daily(date),
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async subtractMonthly(channelSet: ChannelSetModel, date: Date, amount: number): Promise<void> {
    await this.monthAmountModel.updateOne(
      {
        channelSet: channelSet.id,
        date: DateFormat.monthly(date),
      },
      {
        $inc: {
          amount: - Number(amount),
        },
        $set: {
          channelSet: channelSet.id,
          date: DateFormat.monthly(date),
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }
}
