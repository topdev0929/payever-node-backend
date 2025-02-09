import * as moment from 'moment';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  UserPerBusinessDayAmountModel,
  UserPerBusinessMonthAmountModel,
} from '../models';
import { DateFormatEnum, DefaultPeriodEnum, MongooseModel } from '../enums';
import { UserModel } from '../../../user';
import { BusinessModel } from '../../../business/models';
import { DateRevenueInterface } from '../interfaces';

@Injectable()
export class UserPerBusinessTransactionsService {
  constructor(
    @InjectModel(MongooseModel.UserPerBusinessDayAmount)
      private readonly dayAmountModel: Model<UserPerBusinessDayAmountModel>,
    @InjectModel(MongooseModel.UserPerBusinessMonthAmount)
      private readonly monthAmountModel: Model<UserPerBusinessMonthAmountModel>,
  ) { }

  public async getLastDailyRevenues(
    user: UserModel,
    business: BusinessModel,
    days: number = DefaultPeriodEnum.DaysBack,
  ): Promise<DateRevenueInterface[]> {
    if (days < 1) {
      return [];
    }

    const values: UserPerBusinessDayAmountModel[] = await this.dayAmountModel.find({
      businessId: business._id,
      userId: user._id,

      date: {
        $gte: moment().subtract(days, 'days').format(DateFormatEnum.Monthly.toUpperCase()),
      },
    }).exec();

    return [...Array(days).keys()]
      .map((value: number, index: number) => moment().subtract(index, 'day'))
      .reverse()
      .map((date: moment.Moment) => [
        date,
        values.find((v: UserPerBusinessDayAmountModel) => moment(v.date).isSame(date, 'day')),
      ])
      .map(([date, rec]: [moment.Moment, UserPerBusinessDayAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: business.currency,
        date: date.format(DateFormatEnum.Daily.toUpperCase()),
      }));
  }

  public async getLastMonthlyRevenues(
    user: UserModel,
    business: BusinessModel,
    months: number = DefaultPeriodEnum.MonthsBack,
  ): Promise<DateRevenueInterface[]> {
    if (months < 1) { return []; }

    const fromDate: string = moment().subtract(months, 'months').format(DateFormatEnum.Monthly.toUpperCase());

    const values: UserPerBusinessMonthAmountModel[] = await this.monthAmountModel.find({
      date: {
        $gte: fromDate,
      },

      businessId: business._id,
      userId: user._id,
    }).exec();

    return [...Array(months).keys()]
      .map((value: number, index: number) => moment().subtract(index, 'months'))
      .reverse()
      .map((date: moment.Moment) => [
        date,
        values.find((v: UserPerBusinessMonthAmountModel) => moment(v.date).isSame(date, 'month')),
      ])
      .map(([date, rec]: [moment.Moment, UserPerBusinessMonthAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: user.currency,
        date: date.format(DateFormatEnum.Monthly.toUpperCase()),
      }));
  }
}
