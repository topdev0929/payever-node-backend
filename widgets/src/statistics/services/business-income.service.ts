import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessModel } from '../../business/models';
import { MongooseModel as TransactionsModel } from '../../apps/transactions-app/enums';
import { BusinessDayAmountModel, BusinessMonthAmountModel } from '../../apps/transactions-app/models';
import { MongooseModel } from '../enum';
import { TransactionModel } from '../models';
import { DateFormat } from '../tools/date-format';
import { ExportMonthlyBusinessTransactionDto } from '../dto';

@Injectable()
export class BusinessIncomeService {

  constructor(
    @InjectModel(TransactionsModel.BusinessDayAmount)
      private readonly dayAmountModel: Model<BusinessDayAmountModel>,
    @InjectModel(TransactionsModel.BusinessMonthAmount)
      private readonly monthAmountModel: Model<BusinessMonthAmountModel>,
    @InjectModel(MongooseModel.Transaction)
      private readonly transactionModel: Model<TransactionModel>,
  ) { }

  public async updateMonthlyAndTransaction(
    business: BusinessModel,
    monthlyBusinessTransaction: ExportMonthlyBusinessTransactionDto,
  ): Promise<void> {
    const revenue: number = monthlyBusinessTransaction.amount - monthlyBusinessTransaction.refund;
    await this.monthAmountModel.findOneAndUpdate(
      {
        businessId: business.id,
        date: monthlyBusinessTransaction.date,
      },
      {
        $set: {
          amount: Math.ceil(Number(revenue) * 100) / 100,
          businessId: business.id,
          date: monthlyBusinessTransaction.date,
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        upsert: true,
      },
    ).exec();

    for (const transaction of monthlyBusinessTransaction.transactions) {
      await this.transactionModel.findOneAndUpdate(
        {
          _id: transaction.id,
        },
        {
          $set: {
            currency: transaction.currency,
          },
          $setOnInsert: {
            _id: transaction.id,
          },
        },
        {
          upsert: true,
        },
      ).exec();
    }
  }

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
