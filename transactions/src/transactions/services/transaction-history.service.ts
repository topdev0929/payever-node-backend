/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { TransactionHistoryEntryConverter } from '../converter';
import { HistoryEventDataInterface } from '../interfaces/history-event-message';
import { TransactionHistoryEntryInterface } from '../interfaces/transaction';
import {
  HistoryCancelModel,
  HistoryCommonModel,
  HistoryRefundModel,
  HistoryShippingGoodsModel,
  TransactionModel,
} from '../models';
import { TransactionsService } from './transactions.service';
import {
  CancelHistorySchemaName,
  CommonTransactionHistorySchemaName,
  RefundHistorySchemaName,
  ShippingGoodsHistorySchemaName,
  TransactionSchemaName,
} from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentActionsEnum } from '../enum';
import { TransactionHistoryQueryDto, TransactionHistoryResponseDto } from '../dto/history';
import { toTransactionHistoryResponse } from '../transformers';
import * as _ from 'lodash';

@Injectable()
export class TransactionHistoryService {

  constructor(
    @InjectModel(CommonTransactionHistorySchemaName) private readonly historyCommonModel: Model<HistoryCommonModel>,
    @InjectModel(CancelHistorySchemaName) private readonly historyCancelModel: Model<HistoryCancelModel>,
    @InjectModel(RefundHistorySchemaName) private readonly historyRefundModel: Model<HistoryRefundModel>,
    @InjectModel(ShippingGoodsHistorySchemaName)
    private readonly historyShippingGoodsModel: Model<HistoryShippingGoodsModel>,
    @InjectModel(TransactionSchemaName) private readonly transactionModel: Model<TransactionModel>,
    private readonly transactionsService: TransactionsService,
  ) { }

  public async processHistoryRecord(
    transaction: TransactionModel,
    type: string,
    createdAt: Date,
    data: HistoryEventDataInterface,
  ): Promise<void> {
    const actionHistory: TransactionHistoryEntryInterface =
      TransactionHistoryEntryConverter.fromHistoryActionCompletedMessage(transaction, type, createdAt, data);
    await this.pushHistoryRecord(transaction, actionHistory);
  }

  public async prepareTransactionHistory(transaction: TransactionModel): Promise<void> {
    if (transaction.history.length) {
      return;
    }

    transaction.history = await this.fetchAggregatedTransactionHistory(
      transaction,
    ) as Types.DocumentArray<HistoryCommonModel>;
  }

  public async fetchAggregatedTransactionHistory(transaction: TransactionModel): Promise<HistoryCommonModel[]> {
    return this.transactionModel.aggregate([
      {
        $match: { uuid: transaction.uuid },
      },
      {
        $lookup: {
          from: 'history-common',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyCommon',
        },
      },
      {
        $lookup: {
          from: 'history-cancel',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyCancel',
        },
      },
      {
        $lookup: {
          from: 'history-refund',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyRefund',
        },
      },
      {
        $lookup: {
          from: 'history-shipping-goods',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyShippingGoods',
        },
      },
      {
        $project: {
          historyCommon: true,
          historyCancel: true,
          historyRefund: true,
          historyShippingGoods: true,
          _id: false,
        },
      },
      {
        $project: {
          history: { $concatArrays: ['$historyCommon', '$historyCancel', '$historyRefund', '$historyShippingGoods']},
        },
      },
      {
        $unwind: '$history',
      },
      {
        $replaceRoot: { newRoot: '$history' },
      },
      {
        $sort: { created_at: 1 },
      },
    ]);
  }

  public async fetchRecentAggregatedBusinessHistory(
    businessId: string,
    action?: string,
    limit: number = 20,
  ): Promise<HistoryCommonModel[]> {
    return this.transactionModel.aggregate([
      {
        $match: { business_uuid: businessId },
      },
      {
        $lookup: {
          from: 'history-common',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyCommon',
        },
      },
      {
        $lookup: {
          from: 'history-cancel',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyCancel',
        },
      },
      {
        $lookup: {
          from: 'history-refund',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyRefund',
        },
      },
      {
        $lookup: {
          from: 'history-shipping-goods',
          localField: 'uuid',
          foreignField: 'transaction_id',
          as: 'historyShippingGoods',
        },
      },
      {
        $project: {
          historyCommon: true,
          historyCancel: true,
          historyRefund: true,
          historyShippingGoods: true,
          _id: false,
        },
      },
      {
        $project: {
          history: { $concatArrays: ['$historyCommon', '$historyCancel', '$historyRefund', '$historyShippingGoods']},
        },
      },
      {
        $unwind: '$history',
      },
      {
        $replaceRoot: { newRoot: '$history' },
      },
      {
        $match: { action: action ? action : { $exists: true }},
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async getTransactionHistoryResponse(
    transaction: TransactionModel,
    query: TransactionHistoryQueryDto = null,
  ): Promise<TransactionHistoryResponseDto[]> {
    query = query || { };
    let history: HistoryCommonModel[] = transaction.history || [];

    if (!history.length) {
      history = await this.fetchAggregatedTransactionHistory(transaction);
    }

    history.sort(
      (a: HistoryCommonModel, b: HistoryCommonModel) => a.created_at > b.created_at ? -1 : 1,
    );

    if (query.action) {
      history = history.filter((item: HistoryCommonModel) => item.action === query.action);
    }
    if (query.limit) {
      history = history.splice(0, query.limit);
    }

    return history.map((item: any) => toTransactionHistoryResponse(item));
  }

  public async getRecentTransactionHistoryResponse(
    businessId: string,
    queryDto: TransactionHistoryQueryDto = null,
  ): Promise<TransactionHistoryResponseDto[]> {
    const query: any = {
      business_uuid: businessId,
      history: {
        $elemMatch: { action: queryDto.action },
      },
    };

    if (queryDto?.status) {
      query.history.$elemMatch.status = queryDto?.status;
    }

    const transactions: TransactionModel[] = await this.transactionModel
      .find(query)
      .sort({ 'history.created_at': -1 })
      .limit(queryDto.limit || 20)
      .select({ uuid: 1, history: 1 })
      .lean();

    let history: TransactionHistoryResponseDto[] = _.flatten(transactions
      .map((transaction: TransactionModel) =>
        transaction.history
          .filter((item: HistoryCommonModel) => item.action === queryDto.action &&
            (queryDto?.status ? item.status === queryDto.status : true))
          .map((item: any) => toTransactionHistoryResponse(item, transaction.uuid)),
      ));

    const aggregatedHistory: HistoryCommonModel[] =
      await this.fetchRecentAggregatedBusinessHistory(businessId, queryDto.action, queryDto.limit);

    history = history.concat(aggregatedHistory.map(
      (historyEntry: HistoryCommonModel) => toTransactionHistoryResponse(historyEntry, historyEntry.transaction_id),
    ));

    history.sort(
      (a: TransactionHistoryResponseDto, b: TransactionHistoryResponseDto) => a.createdAt > b.createdAt ? -1 : 1,
    );
    history = history.splice(0, queryDto.limit || 20);

    return history;
  }

  private async pushHistoryRecord(
    transaction: TransactionModel,
    history: TransactionHistoryEntryInterface,
  ): Promise<void> {
    // for old transactions that have history inside - we continue storing it there
    if (transaction.history.length) {
      await this.transactionsService.pushHistoryRecord(transaction, history);

      return;
    }

    // new way - store history in separate collection
    let historyModel: Model<HistoryCommonModel>;
    switch (history.action) {
      case PaymentActionsEnum.Cancel:
        historyModel = this.historyCancelModel;
        break;
      case PaymentActionsEnum.Refund:
        historyModel = this.historyRefundModel;
        break;
      case PaymentActionsEnum.ShippingGoods:
        historyModel = this.historyShippingGoodsModel;
        break;
      default:
        historyModel = this.historyCommonModel;
        break;
    }

    const createdHistoryModel: HistoryCommonModel = await historyModel.create(history);
    await this.transactionsService.pushHistoryId(transaction, createdHistoryModel.id);
  }
}
