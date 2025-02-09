import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dateFormat from 'dateformat';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../../../statistics';
import { DateFormatEnum, DefaultPeriodEnum, MongooseModel } from '../enums';
import { DateRevenueInterface } from '../interfaces';
import { ChannelSetDayAmountModel, ChannelSetMonthAmountModel } from '../models';

@Injectable()
export class ChannelSetTransactionsService {

  constructor(
    private readonly logger: Logger,
    @InjectModel(MongooseModel.ChannelSetDayAmount)
    private readonly dayAmountModel: Model<ChannelSetDayAmountModel>,
    @InjectModel(MongooseModel.ChannelSetMonthAmount)
    private readonly monthAmountModel: Model<ChannelSetMonthAmountModel>,
  ) { }

  public async getLastDailyRevenues(
    channelSet: ChannelSetModel,
    days: number = DefaultPeriodEnum.DaysBack,
  ): Promise<DateRevenueInterface[]> {
    if (days < 1) {
      return [];
    }

    const values: ChannelSetDayAmountModel[] = await this.dayAmountModel.find(
      {
        channelSet: channelSet.id,
        date: {
          $gte : moment().subtract(days, 'days').format(DateFormatEnum.Daily.toUpperCase()),
        },
      },
    ).exec();

    return [...Array(days).keys()]
      .map((_: any, idx: any) => moment().subtract(idx, 'day'))
      .reverse()
      .map((date: any) => [date, values.find((r: ChannelSetDayAmountModel) => moment(r.date).isSame(date, 'day'))])
      .map(([date, rec]: [moment.Moment, ChannelSetDayAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: channelSet.currency,
        date: date.format(DateFormatEnum.Daily.toUpperCase()),
      }));
  }

  public async getLastMonthlyRevenues(
    channelSet: ChannelSetModel,
    months: number = DefaultPeriodEnum.MonthsBack,
  ): Promise<DateRevenueInterface[]> {
    if (months < 1) {
      return [];
    }

    const values: ChannelSetMonthAmountModel[] = await this.monthAmountModel.find(
      {
        channelSet: channelSet.id,
        date: {
          $gte : moment().subtract(months, 'months').format(DateFormatEnum.Monthly.toUpperCase()),
        },
      },
    ).exec();

    return [...Array(months).keys()]
      .map((_: any, idx: any) => moment().subtract(idx, 'months'))
      .reverse()
      .map((date: any) => [date, values.find((r: ChannelSetMonthAmountModel) => moment(r.date).isSame(date, 'months'))])
      .map(([date, rec]: [moment.Moment, ChannelSetMonthAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: channelSet.currency,
        date: date.format(DateFormatEnum.Monthly.toUpperCase()),
      }));
  }

  public async deleteDailyAmount(channelSet: ChannelSetModel): Promise<void> {
    await this.dayAmountModel.deleteMany({ channelSet: channelSet.id }).exec();
  }

  public async deleteMonthlyAmount(channelSet: ChannelSetModel): Promise<void> {
    await this.monthAmountModel.deleteMany({ channelSet: channelSet.id }).exec();
  }

  private formatDaily(date: Date): string {
    return dateFormat(date, DateFormatEnum.Daily);
  }

  private formatMonthly(date: Date): string {
    return dateFormat(date, DateFormatEnum.Monthly);
  }
}
