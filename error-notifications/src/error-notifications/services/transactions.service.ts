import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionSchemaName } from '../schemas';
import { TransactionModel } from '../models';
import { PaymentEventDto } from '../dto';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { TransactionInterface } from '../interfaces';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionSchemaName) private readonly transactionModel: Model<TransactionModel>,
    private readonly mutex: Mutex,
  ) { }

  public async createOrUpdateFromEventDto(paymentEventDto: PaymentEventDto): Promise<void> {
    const transaction: TransactionInterface = TransactionsService.paymentEventDtoToTransaction(paymentEventDto);

    const insertData: any = {
      _id: paymentEventDto.uuid,
      originalId: paymentEventDto.id,
    };
    delete transaction.originalId;

    await this.mutex.lock(
      'error-notifications-transactions',
      insertData.uuid,
      async () =>  this.transactionModel.findOneAndUpdate(
        { _id: insertData._id },
        {
          $set: transaction,
          $setOnInsert: insertData,
        },
        {
          new: true,
          upsert: true,
        },
      ),
    );

  }

  public async removeById(id: string): Promise<void> {
    await this.transactionModel.findOneAndRemove({ _id: id });
  }

  public async getLastTransactions(
    businessId: string,
    integration: string,
    limit: number,
  ): Promise<TransactionModel[]> {
    return this.transactionModel.find(
      {
        businessId: businessId,
        paymentType: integration,
      },
      null,
      {
        limit: limit,
        sort: {
          updatedAt: -1,
        },
      },
    );
  }

  private static paymentEventDtoToTransaction(paymentEventDto: PaymentEventDto): TransactionInterface {
    return {
      businessId: paymentEventDto.business.id,
      originalId: paymentEventDto.id,
      paymentType: paymentEventDto.payment_type,
      status: paymentEventDto.status,
      updatedAt: paymentEventDto.updated_at,
    };
  }

}

