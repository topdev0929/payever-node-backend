import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessModel } from '../../business/models';
import { MongooseModel as InvoiceModel } from '../../apps/invoice-app/enums';
import { BusinessDayAmountModel, BusinessMonthAmountModel } from '../../apps/invoice-app/models';
import { MongooseModel } from '../enum';
import { TransactionModel } from '../models';
import { DateFormat } from '../tools/date-format';

@Injectable()
export class InvoiceBusinessIncomeService {

  constructor(
    @InjectModel(InvoiceModel.BusinessDayAmount)
      private readonly dayAmountModel: Model<BusinessDayAmountModel>,
    @InjectModel(InvoiceModel.BusinessMonthAmount)
      private readonly monthAmountModel: Model<BusinessMonthAmountModel>,
  ) { }

  public async add(business: BusinessModel, date: Date, amount: number): Promise<void> {
    amount = Math.ceil(Number(amount) * 100) / 100;
    await this.addDaily(business, date, amount);
    await this.addMonthly(business, date, amount);
  }

  public async subtract(business: BusinessModel, date: Date, amount: number): Promise<void> {
    amount = Math.ceil(Number(amount) * 100) / 100;
    await this.subtractDaily(business, date, amount);
    await this.subtractMonthly(business, date, amount);
  }

  private async addDaily(business: BusinessModel, date: Date, amount: number): Promise<void> {
    await this.dayAmountModel.updateOne(
      {
        businessId: business.id,
        date: DateFormat.daily(date),
      },
      {
        $inc: {
          amount: Number(amount),
        },
        $set: {
          businessId: business.id,
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

  private async addMonthly(business: BusinessModel, date: Date, amount: number): Promise<void> {
    await this.monthAmountModel.updateOne(
      {
        businessId: business.id,
        date: DateFormat.monthly(date),
      },
      {
        $inc: {
          amount: Number(amount),
        },
        $set: {
          businessId: business.id,
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

  private async subtractDaily(business: BusinessModel, date: Date, amount: number): Promise<void> {
    await this.dayAmountModel.updateOne(
      {
        businessId: business.id,
        date: DateFormat.daily(date),
      },
      {
        $inc: {
          amount: - Number(amount),
        },
        $set: {
          businessId: business.id,
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

  private async subtractMonthly(business: BusinessModel, date: Date, amount: number): Promise<void> {
    await this.monthAmountModel.updateOne(
      {
        businessId: business.id,
        date: DateFormat.monthly(date),
      },
      {
        $inc: {
          amount: - Number(amount),
        },
        $set: {
          businessId: business.id,
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
