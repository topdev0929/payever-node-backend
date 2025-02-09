import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MongooseModel, UserPerBusinessDayAmountModel, UserPerBusinessMonthAmountModel } from '../../apps/transactions-app';
import { ExportMonthlyUserPerBusinessTransactionDto } from '../dto';
import { UserModel } from '../../user';
import { DateFormat } from '../tools/date-format';
import { BusinessModel } from '../../business';

@Injectable()
export class UserIncomeService {
  constructor(
    @InjectModel(MongooseModel.UserPerBusinessDayAmount)
      private readonly userPerBusinessDayAmountModel: Model<UserPerBusinessDayAmountModel>,
    @InjectModel(MongooseModel.UserPerBusinessMonthAmount)
      private readonly userPerBusinessMonthAmountModel: Model<UserPerBusinessMonthAmountModel>,
  ) { }

  public async updateUserPerBusinessMonthly(data: ExportMonthlyUserPerBusinessTransactionDto): Promise<void> {
    await this.userPerBusinessMonthAmountModel.findOneAndUpdate(
      {
        date: data.date,

        businessId: data.businessId,
        userId: data.userId,
      },
      {
        amount: data.totalSpent,
        currency: data.currency,
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async add(user: UserModel, business: BusinessModel, date: Date, amount: number): Promise<void> {
    amount = Math.ceil(Number(amount) * 100) / 100;
    await this.addDaily(user, business, date, amount);
    await this.addMonthly(user, business, date, amount);
  }

  public async subtract(user: UserModel, business: BusinessModel, date: Date, amount: number): Promise<void> {
    amount = Math.ceil(Number(amount) * 100) / 100;
    await this.addDaily(user, business, date, -amount);
    await this.addMonthly(user, business, date, -amount);
  }

  private async addDaily(user: UserModel, business: BusinessModel, date: Date, amount: number): Promise<void> {
    await this.userPerBusinessDayAmountModel.findOneAndUpdate(
      {
        businessId: business._id,
        userId: user._id,

        date: DateFormat.daily(date),
      },
      {
        $inc: {
          amount: Number(amount),
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

  private async addMonthly(user: UserModel, business: BusinessModel, date: Date, amount: number): Promise<void> {
    await this.userPerBusinessMonthAmountModel.findOneAndUpdate(
      {
        businessId: business._id,
        userId: user._id,

        date: DateFormat.monthly(date),
      },
      {
        $inc: {
          amount: Number(amount),
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

