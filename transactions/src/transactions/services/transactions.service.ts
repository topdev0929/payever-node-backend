import { Injectable, Logger } from '@nestjs/common';
import { ValuesService } from '@pe/common-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { TransactionPaymentDetailsConverter } from '../converter';
import {
  ChannelsWithTransactionCountInterface,
  TransactionHistoryEntryInterface,
  TransactionPackedDetailsInterface,
  TransactionUnpackedDetailsInterface,
} from '../interfaces';
import { HistoryCommonModel, TransactionModel } from '../models';
import { TransactionsNotifier } from '../notifiers';
import { AuthEventsProducer } from '../producer';
import { TransactionSchemaName } from '../schemas';
import { TransactionEventEnum } from '../enum/events';

const TransactionMutexKey: string = 'transactions-transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionSchemaName) private readonly transactionModel: Model<TransactionModel>,
    @InjectNotificationsEmitter() private readonly notificationsEmitter: NotificationsEmitter,
    private readonly authEventsProducer: AuthEventsProducer,
    private readonly notifier: TransactionsNotifier,
    private readonly mutex: Mutex,
    private readonly logger: Logger,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(transactionDto: TransactionPackedDetailsInterface): Promise<TransactionModel> {
    if (transactionDto.id) {
      transactionDto.original_id = transactionDto.id;
    }

    if (!transactionDto.uuid) {
      transactionDto.uuid = uuid();
    }

    const created: TransactionModel = await this.mutex.lock(
      TransactionMutexKey,
      transactionDto.uuid,
      async () => this.transactionModel.create({
        ...transactionDto as TransactionModel,
        _id: transactionDto.uuid,
      }),
    );

    await this.eventDispatcher.dispatch(TransactionEventEnum.TransactionCreated, created);

    await this.notifier.sendNewTransactionNotification(created);
    if (transactionDto.seller_email) {
      await this.authEventsProducer.getSellerName({ email: transactionDto.seller_email });
    }

    return created;
  }

  public async updateByUuid(
    transactionUuid: string,
    transactionDto: TransactionPackedDetailsInterface,
  ): Promise<TransactionModel> {
    const insertData: any = {
      _id: transactionUuid,
      uuid: transactionUuid,
    };
    if (transactionDto.id) {
      insertData.original_id = transactionDto.id;
    }

    delete transactionDto.id;
    delete transactionDto.original_id;
    delete transactionDto.uuid;

    const updated: TransactionModel = await this.mutex.lock(
      TransactionMutexKey,
      transactionUuid,
      async () => this.transactionModel.findOneAndUpdate(
        {
          uuid: transactionUuid,
        },
        {
          $set: transactionDto as any,
          $setOnInsert: insertData,
        },
        {
          new: true,
          upsert: true,
        },
      ),
    );

    await this.eventDispatcher.dispatch(
      TransactionEventEnum.TransactionUpdated,
      updated,
      true,
    );

    return updated;
  }

  public async updateTransactionAnonymizedDataByUuid(
    transactionUuid: string,
    transaction: TransactionModel,
  ): Promise<TransactionModel> {
    delete transaction._id;

    const updated: TransactionModel = await this.mutex.lock(
      TransactionMutexKey,
      transactionUuid,
      async () => this.transactionModel.findOneAndUpdate(
        {
          uuid: transactionUuid,
        },
        {
          $set: {
            anonymized: transaction.anonymized,
            billing_address: transaction.billing_address,
            customer_email: transaction.customer_email,
            customer_name: transaction.customer_name,
            payment_details: transaction.payment_details,
            seller_email: transaction.seller_email,
            seller_name: transaction.seller_name,
            shipping_address: transaction.shipping_address,
          },
        },
        {
          new: true,
        }
      ),
    );

    await this.eventDispatcher.dispatch(
      TransactionEventEnum.TransactionUpdated,
      updated,
      true,
    );

    return updated;
  }

  public async updateHistoryByUuid(
    transactionUuid: string,
    transactionHistory: HistoryCommonModel[],
  ): Promise<TransactionModel> {
    const updated: TransactionModel = await this.mutex.lock(
      TransactionMutexKey,
      transactionUuid,
      async () => this.transactionModel.findOneAndUpdate(
        {
          uuid: transactionUuid,
        },
        {
          $set: {
            history: transactionHistory as any,
          },
        },
        {
          new: true,
        },
      ),
    );

    await this.eventDispatcher.dispatch(
      TransactionEventEnum.TransactionUpdated,
      updated,
    );

    return updated;
  }

  public async findModelByUuid(transactionUuid: string): Promise<TransactionModel> {
    return this.findModelByParams({ uuid: transactionUuid });
  }

  public async findModelByParams(params: any): Promise<TransactionModel> {
    const transactionModel: TransactionModel[]
      = await this.transactionModel.find(params).sort({ created_at: -1 }).limit(1);
    if (!transactionModel || !transactionModel.length) {
      return null;
    }

    return transactionModel[0];
  }

  public async findAllUuidByFilter(filter: any): Promise<string[]> {
    const transactions: TransactionModel[] = await this.transactionModel.find(
      filter,
      {
        _id: -1,
        uuid: 1,
      },
    );

    return transactions.map((transaction: TransactionModel) => {
      return transaction.uuid;
    });
  }

  public async getChannelsWithTransactionsCount(businessId: string): Promise<ChannelsWithTransactionCountInterface[]> {
    const channelsWithTransactions: Array<{ _id: string; transactionCount: number }> = 
      await this.transactionModel.aggregate([
        {
          $match: {
            business_uuid: businessId,
          },
        },
        {
          $group: {
            _id: '$channel',
            transactionCount: { $sum: 1 },
          },
        },
        {
          $match: {
            transactionCount: { $gte:  1 },
          },
        },
        {
          $sort: { 
            transactionCount: -1,
          },
        },
      ]);

    const channels: Array<Omit<ChannelsWithTransactionCountInterface, 'transactionCount'>> = 
      ValuesService.getChannelValuesDescriptions();

    const result: Array<ChannelsWithTransactionCountInterface | null> = 
      channelsWithTransactions.map(item => {
        const channelInfo: { [key: string]: any } = channels.find(channel => channel.name === item._id);

        return channelInfo ? { 
          icon: channelInfo.icon,
          label: channelInfo.label,
          name: channelInfo.name,
          transactionCount: item.transactionCount,
        } : null;
      }).filter(Boolean);

    return result;
  }


  public async findCollectionByParams(params: any): Promise<TransactionModel[]> {
    return this.transactionModel.find(params);
  }

  public async findUnpackedByUuid(transactionUuid: string): Promise<TransactionUnpackedDetailsInterface> {
    return this.findUnpackedByParams({ uuid: transactionUuid });
  }

  public async findUnpackedByParams(params: any): Promise<TransactionUnpackedDetailsInterface> {
    const transaction: TransactionModel = await this.transactionModel.findOne(params);

    if (!transaction) {
      return;
    }

    return TransactionPaymentDetailsConverter.convert(transaction.toObject({ virtuals: true }));
  }

  public async findAll(businessId: string): Promise<TransactionModel[]> {
    return this.transactionModel.find({ business_uuid: businessId });
  }

  public async removeByUuid(transactionId: string): Promise<void> {
    const transaction: TransactionModel =
      await this.transactionModel.findOneAndRemove({ uuid: transactionId });
    if (!transaction) {
      return;
    }

    await this.eventDispatcher.dispatch(
      TransactionEventEnum.TransactionDeleted,
      transaction.uuid,
    );
  }

  public async pushHistoryRecord(
    transaction: TransactionModel,
    history: TransactionHistoryEntryInterface,
  ): Promise<void> {
    const updated: TransactionModel = await this.mutex.lock(
      TransactionMutexKey,
      transaction.uuid,
      async () => this.transactionModel.findOneAndUpdate(
        { uuid: transaction.uuid },
        {
          $push: {
            history: history as any,
          },
        },
        {
          new: true,
        },
      ),
    );

    await this.eventDispatcher.dispatch(
      TransactionEventEnum.TransactionUpdated,
      updated,
    );
  }

  public async pushHistoryId(
    transaction: TransactionModel,
    historyId: string,
  ): Promise<void> {
    await this.mutex.lock(
      TransactionMutexKey,
      transaction.uuid,
      async () => this.transactionModel.findOneAndUpdate(
        { uuid: transaction.uuid },
        {
          $push: {
            historyIds: historyId,
          },
        },
        {
          new: true,
        },
      ),
    );
  }

  public async setShippingOrderProcessed(
    transactionId: string,
  ): Promise<TransactionModel> {
    return this.mutex.lock(
      TransactionMutexKey,
      transactionId,
      async () => this.transactionModel.findOneAndUpdate(
        { uuid: transactionId },
        {
          $set: {
            is_shipping_order_processed: true,
          },
        },
        {
          new: true,
        },
      ),
    );
  }
}
