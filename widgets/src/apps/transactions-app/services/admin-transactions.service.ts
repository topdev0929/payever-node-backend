import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';

import { UserModel } from '../../../user/models';
import { DateFormatEnum, DefaultPeriodEnum, MongooseModel } from '../enums';
import { DateRevenueInterface } from '../interfaces';
import { UserDayAmountModel, UserMonthAmountModel } from '../models';

@Injectable()
export class AdminTransactionsService {

  constructor(
    @InjectModel(MongooseModel.UserDayAmount) private readonly dayAmountModel: Model<UserDayAmountModel>,
    @InjectModel(MongooseModel.UserMonthAmount) private readonly monthAmountModel: Model<UserMonthAmountModel>,
  ) { }

  public async getLastDailyRevenues(
    user: UserModel,
    days: number = DefaultPeriodEnum.DaysBack,
  ): Promise<DateRevenueInterface[]> {
    if (days < 1) {
      return [];
    }

    const values: UserDayAmountModel[] = await this.dayAmountModel.find(
      {
        date: {
          $gte : moment().subtract(days, 'days').format(DateFormatEnum.Daily.toUpperCase()),
        },
      },
    ).exec();

    return [...Array(days).keys()]
      .map((_: any, idx: any) => moment().subtract(idx, 'days'))
      .reverse()
      .map((date: any) => [
        date,
        values.find((v: UserDayAmountModel) => moment(v.date).isSame(date, 'day')),
      ])
      .map(([date, rec]: [moment.Moment, UserDayAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: user.currency,
        date: date.format(DateFormatEnum.Daily.toUpperCase()),
      }));
  }

  public async getLastMonthlyRevenues(
    user: UserModel,
    months: number = DefaultPeriodEnum.MonthsBack,
  ): Promise<DateRevenueInterface[]> {
    if (months < 1) {
      return [];
    }

    const values: UserMonthAmountModel[] = await this.monthAmountModel.find(
      {
        date: {
          $gte : moment().subtract(months, 'months').format(DateFormatEnum.Monthly.toUpperCase()),
        },
      },
    ).exec();

    return [...Array(months).keys()]
      .map((_: any, idx: any) => moment().subtract(idx, 'months'))
      .reverse()
      .map((date: any) => [
        date,
        values.find((v: UserMonthAmountModel) => moment(v.date).isSame(date, 'month')),
      ])
      .map(([date, rec]: [moment.Moment, UserMonthAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: user.currency,
        date: date.format(DateFormatEnum.Monthly.toUpperCase()),
      }));
  }
}
