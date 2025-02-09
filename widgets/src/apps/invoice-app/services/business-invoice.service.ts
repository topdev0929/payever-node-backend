import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import * as dateFormat from 'dateformat';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../business/models';
import { DateFormatEnum, DefaultPeriodEnum, MongooseModel } from '../enums';
import { DateRevenueInterface } from '../interfaces';
import { BusinessDayAmountModel, BusinessMonthAmountModel } from '../models';

@Injectable()
export class BusinessInvoiceService {

  constructor(
    @InjectModel(MongooseModel.BusinessDayAmount) private readonly dayAmountModel: Model<BusinessDayAmountModel>,
    @InjectModel(MongooseModel.BusinessMonthAmount) private readonly monthAmountModel: Model<BusinessMonthAmountModel>,
  ) { }

  public async getLastDailyRevenues(
    business: BusinessModel,
    days: number = DefaultPeriodEnum.DaysBack,
  ): Promise<DateRevenueInterface[]> {
    if (days < 1) {
      return [];
    }

    const values: BusinessDayAmountModel[] = await this.dayAmountModel.find(
      {
        businessId: business.id,
        date: {
          $gte : moment().subtract(days, 'days').format(DateFormatEnum.Daily.toUpperCase()),
        },
      },
    ).exec();

    return [...Array(days).keys()]
      .map((_: any, idx: any) => moment().subtract(idx, 'day')).reverse()
      .map((date: any) => [date, values.find((r: BusinessDayAmountModel) => moment(r.date).isSame(date, 'day'))])
      .map(([date, rec]: [moment.Moment, BusinessDayAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: business.currency,
        date: date.format(DateFormatEnum.Daily.toUpperCase()),
      }));
  }

  public async getLastMonthlyRevenues(
    business: BusinessModel,
    months: number = DefaultPeriodEnum.MonthsBack,
  ): Promise<DateRevenueInterface[]> {
    if (months < 1) {
      return [];
    }

    const values: BusinessMonthAmountModel[] = await this.monthAmountModel.find(
      {
        businessId: business.id,
        date: {
          $gte : moment().subtract(months, 'months').format(DateFormatEnum.Monthly.toUpperCase()),
        },
      },
    ).exec();

    return [...Array(months).keys()]
      .map((_: any, idx: any) => moment().subtract(idx, 'months')).reverse()
      .map((date: any) => [date, values.find((r: BusinessMonthAmountModel) => moment(r.date).isSame(date, 'months'))])
      .map(([date, rec]: [moment.Moment, BusinessMonthAmountModel]) => ({
        amount: rec ? rec.amount : 0,
        currency: business.currency,
        date: date.format(DateFormatEnum.Monthly.toUpperCase()),
      }));
  }

  public async deleteDailyAmount(business: BusinessModel): Promise<void> {
    await this.dayAmountModel.deleteMany({ businessId: business.id }).exec();
  }

  public async deleteMonthlyAmount(business: BusinessModel): Promise<void> {
    await this.monthAmountModel.deleteMany({ businessId: business.id }).exec();
  }

  private formatDaily(date: Date): string {
    return dateFormat(date, DateFormatEnum.Daily);
  }

  private formatMonthly(date: Date): string {
    return dateFormat(date, DateFormatEnum.Monthly);
  }
}
