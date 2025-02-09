import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { MongooseModel } from '../enum';
import { TransactionModel } from '../models';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectModel(MongooseModel.Transaction)
      private readonly transactionModel: Model<TransactionModel>,
  ) { }

  public async considerTransaction(id: string, business: BusinessModel): Promise<void> {
    await this.transactionModel.findOneAndUpdate(
      { _id: id }, 
      { 
        $set: {
          currency: business.currency,
        }, 
      },
      { upsert: true },
    );
  }

  public async findOneById(id: string): Promise<TransactionModel> {
    return this.transactionModel.findById(id);
  }

  public async removeById(id: string): Promise<TransactionModel> {
    return this.transactionModel.findByIdAndRemove(id);
  }
}
